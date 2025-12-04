# Cromos Database Documentation

## Overview

Il database di Cromos è basato su PostgreSQL e utilizza lo schema di Medusa.js esteso con tabelle custom per la gestione specifica degli accessori telefonia e l'integrazione con Denea Easy FTT.

## Architettura

### Schema Base Medusa.js

Il database include tutte le tabelle standard di Medusa.js per e-commerce:

- **Products & Variants**: Gestione prodotti e varianti
- **Orders & Carts**: Gestione ordini e carrelli
- **Customers**: Gestione clienti
- **Inventory**: Gestione magazzino
- **Payments**: Gestione pagamenti
- **Shipping**: Gestione spedizioni

### Estensioni Custom Cromos

#### 1. Phone Accessorie Category
**Tabella**: `phone_accessorie_category`

Gestisce le categorie specifiche per accessori telefonia.

```sql
CREATE TABLE phone_accessorie_category (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    phone_brand VARCHAR,        -- Apple, Samsung, Xiaomi, etc.
    phone_model VARCHAR,        -- iPhone 15, Galaxy S24, etc.
    accessory_type VARCHAR,     -- cover, screen_protector, charger
    compatibility TEXT,         -- Modelli compatibili
    material VARCHAR,           -- silicone, leather, glass
    color VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    category_id VARCHAR,        -- Link a product_category
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

**Campi Principali**:
- `phone_brand`: Marca del telefono (Apple, Samsung, Xiaomi, etc.)
- `phone_model`: Modello specifico (iPhone 15 Pro, Galaxy S24 Ultra)
- `accessory_type`: Tipo accessorio (cover, screen_protector, charger, cable)
- `compatibility`: Lista modelli compatibili
- `material`: Materiale (silicone, leather, glass, plastic, metal)

#### 2. Product Extended
**Tabella**: `product_extended`

Estende i prodotti Medusa con attributi specifici per telefonia.

```sql
CREATE TABLE product_extended (
    id VARCHAR PRIMARY KEY,
    product_id VARCHAR NOT NULL REFERENCES product(id),
    
    -- Attributi Telefonia
    phone_brand VARCHAR,
    phone_model VARCHAR,
    compatibility TEXT,
    accessory_type VARCHAR,
    material VARCHAR,
    color VARCHAR,
    size VARCHAR,
    wireless_charging_compatible BOOLEAN DEFAULT FALSE,
    connector_type VARCHAR,     -- USB-C, Lightning, Micro-USB
    cable_length VARCHAR,       -- 1m, 2m, 3m
    power_output VARCHAR,       -- 20W, 65W, etc.
    fast_charging BOOLEAN DEFAULT FALSE,
    screen_size VARCHAR,        -- Per pellicole
    protection_level VARCHAR,   -- 9H, military grade
    
    -- Integrazione Denea
    denea_sku VARCHAR,
    denea_category VARCHAR,
    supplier_code VARCHAR,
    cost_price DECIMAL(10,2),
    margin_percentage DECIMAL(5,2),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    
    -- SEO & Marketing
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords VARCHAR,
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

**Sezioni**:
1. **Attributi Telefonia**: Specifici per accessori smartphone
2. **Integrazione Denea**: Mappatura con gestionale esterno
3. **SEO & Marketing**: Ottimizzazioni e flag promozionali

#### 3. Inventory Sync Log
**Tabella**: `inventory_sync_log`

Traccia tutte le sincronizzazioni del magazzino.

```sql
CREATE TABLE inventory_sync_log (
    id VARCHAR PRIMARY KEY,
    sync_type VARCHAR NOT NULL,     -- 'denea_import', 'manual_update', 'webhook'
    status VARCHAR NOT NULL,        -- 'success', 'error', 'partial'
    items_processed INTEGER DEFAULT 0,
    items_success INTEGER DEFAULT 0,
    items_error INTEGER DEFAULT 0,
    error_details JSONB,
    sync_data JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Tipi di Sync**:
- `denea_import`: Importazione da Denea Easy FTT
- `manual_update`: Aggiornamento manuale
- `webhook`: Aggiornamento via webhook

#### 4. Denea Sync Mapping
**Tabella**: `denea_sync_mapping`

Mappa gli SKU Denea con le varianti Medusa.

```sql
CREATE TABLE denea_sync_mapping (
    id VARCHAR PRIMARY KEY,
    denea_sku VARCHAR NOT NULL UNIQUE,
    medusa_variant_id VARCHAR NOT NULL,
    denea_product_name VARCHAR,
    denea_category VARCHAR,
    mapping_status VARCHAR DEFAULT 'active',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_errors JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Indici per Performance

### Indici Standard Medusa
- Prodotti: handle, status, collection, type, created_at
- Varianti: product_id, sku, inventory_quantity
- Prezzi: variant_id, region_id, currency_code
- Carrelli: customer_id, region_id, created_at
- Ordini: customer_id, status, created_at, display_id

### Indici Custom Cromos
- Product Extended: product_id, phone_brand, accessory_type, denea_sku, is_featured
- Denea Mapping: denea_sku, medusa_variant_id, mapping_status
- Sync Log: sync_type, status, created_at

## Relazioni Principali

### Prodotti e Estensioni
```
product (1) ←→ (1) product_extended
product (1) ←→ (n) product_variant
product_variant (1) ←→ (1) denea_sync_mapping
```

### Categorie
```
product_category (1) ←→ (n) phone_accessorie_category
product (n) ←→ (n) product_category (via product_category_product)
```

### Inventario
```
product_variant (1) ←→ (n) inventory_item
inventory_sync_log (1) ←→ (n) sync_operations
```

## Query Comuni

### 1. Prodotti per Marca Telefono
```sql
SELECT p.*, pe.phone_brand, pe.phone_model, pe.accessory_type
FROM product p
JOIN product_extended pe ON p.id = pe.product_id
WHERE pe.phone_brand = 'Apple'
AND pe.accessory_type = 'cover'
AND p.status = 'published';
```

### 2. Prodotti in Evidenza
```sql
SELECT p.*, pe.*, pv.sku, ma.amount as price
FROM product p
JOIN product_extended pe ON p.id = pe.product_id
JOIN product_variant pv ON p.id = pv.product_id
JOIN money_amount ma ON pv.id = ma.variant_id
WHERE pe.is_featured = TRUE
AND p.status = 'published'
ORDER BY pe.created_at DESC;
```

### 3. Sincronizzazioni Recenti
```sql
SELECT * FROM inventory_sync_log
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### 4. Mappature Denea Attive
```sql
SELECT dsm.*, pv.sku, p.title
FROM denea_sync_mapping dsm
JOIN product_variant pv ON dsm.medusa_variant_id = pv.id
JOIN product p ON pv.product_id = p.id
WHERE dsm.mapping_status = 'active';
```

## Backup e Manutenzione

### Backup Automatico
```bash
# Backup giornaliero
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Backup con compressione
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Pulizia Log
```sql
-- Rimuovi log sincronizzazioni più vecchi di 30 giorni
DELETE FROM inventory_sync_log 
WHERE created_at < NOW() - INTERVAL '30 days';

-- Rimuovi carrelli abbandonati più vecchi di 7 giorni
DELETE FROM cart 
WHERE completed_at IS NULL 
AND created_at < NOW() - INTERVAL '7 days';
```

### Ottimizzazione
```sql
-- Analizza statistiche tabelle
ANALYZE;

-- Ricostruisci indici se necessario
REINDEX DATABASE cromos_db;

-- Vacuum per recuperare spazio
VACUUM ANALYZE;
```

## Monitoraggio

### Query Performance
```sql
-- Query più lente
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Dimensioni Tabelle
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Connessioni Attive
```sql
SELECT count(*) as active_connections
FROM pg_stat_activity
WHERE state = 'active';
```

## Sicurezza

### Utenti Database
- **Admin**: Accesso completo per migrazioni e manutenzione
- **App**: Accesso read/write per l'applicazione
- **Readonly**: Accesso sola lettura per analytics

### Backup Encryption
```bash
# Backup criptato
pg_dump $DATABASE_URL | gpg --cipher-algo AES256 --compress-algo 1 --symmetric --output backup.sql.gpg
```

## Configurazione Neon

### Connection String
```
postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/cromos_db?sslmode=require
```

### Pooling
- **Connection Pooling**: Abilitato
- **Max Connections**: 100
- **Pool Size**: 20

### Monitoring
- **Query Performance**: Abilitato
- **Slow Query Log**: > 1000ms
- **Connection Monitoring**: Abilitato
