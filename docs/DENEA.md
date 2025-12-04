# Cromos - Integrazione Denea Easy FTT

Guida completa per l'integrazione con il gestionale Denea Easy FTT per la sincronizzazione automatica del magazzino.

## 📖 Overview

L'integrazione Denea Easy FTT permette di:
- 🔄 **Sincronizzazione automatica** del magazzino
- 📊 **Import/Export** dati prodotti
- ⚡ **Webhook real-time** per aggiornamenti istantanei
- 📈 **Monitoring** e logging delle operazioni
- 🔧 **Mappatura SKU** personalizzabile

## 🏗️ Architettura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Denea Easy FTT │    │ Cromos Backend  │    │   Database      │
│   Gestionale    │◄──►│  Integration    │◄──►│  PostgreSQL     │
│                 │    │    Service      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   Scheduler     │              │
         └──────────────►│   (Railway)     │◄─────────────┘
                        │   Cron Jobs     │
                        └─────────────────┘
```

## 🔧 Configurazione

### 1. Variabili d'Ambiente

#### Backend (.env)
```env
# Denea API Configuration
DENEA_API_URL=https://your-denea-api-endpoint.com
DENEA_API_KEY=your_denea_api_key
DENEA_WEBHOOK_SECRET=your_denea_webhook_secret

# Medusa Integration
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_API_KEY=your_medusa_admin_api_key
```

#### Integration Service (.env)
```env
# Denea Configuration
DENEA_API_URL=https://your-denea-api-endpoint.com
DENEA_API_KEY=your_denea_api_key
DENEA_WEBHOOK_SECRET=your_denea_webhook_secret

# Medusa Backend
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_API_KEY=your_medusa_admin_api_key

# Webhook Server
WEBHOOK_PORT=3001
NODE_ENV=development
```

### 2. Formato Dati Denea

#### CSV Format
```csv
codice;descrizione;categoria;giacenza;prezzo;prezzo_acquisto;fornitore;marca;modello;colore;materiale;compatibilita
COVER001;Cover iPhone 15 Pro;Accessori;50;19.99;12.50;Supplier1;Apple;iPhone 15 Pro;Nero;Silicone;iPhone 15 Pro
PELL001;Pellicola iPhone 15;Protezioni;30;9.99;6.00;Supplier2;Apple;iPhone 15;Trasparente;Vetro;iPhone 15,iPhone 15 Plus
```

#### XML Format
```xml
<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product>
    <codice>COVER001</codice>
    <descrizione>Cover iPhone 15 Pro</descrizione>
    <categoria>Accessori</categoria>
    <giacenza>50</giacenza>
    <prezzo>19.99</prezzo>
    <prezzo_acquisto>12.50</prezzo_acquisto>
    <fornitore>Supplier1</fornitore>
    <marca>Apple</marca>
    <modello>iPhone 15 Pro</modello>
    <colore>Nero</colore>
    <materiale>Silicone</materiale>
    <compatibilita>iPhone 15 Pro</compatibilita>
  </product>
</products>
```

#### JSON API Format
```json
{
  "products": [
    {
      "sku": "COVER001",
      "name": "Cover iPhone 15 Pro",
      "category": "Accessori",
      "stock": 50,
      "price": 19.99,
      "cost_price": 12.50,
      "supplier": "Supplier1",
      "brand": "Apple",
      "model": "iPhone 15 Pro",
      "color": "Nero",
      "material": "Silicone",
      "compatibility": "iPhone 15 Pro"
    }
  ]
}
```

## 🚀 Setup e Installazione

### 1. Installazione Dipendenze

```bash
cd integrations
npm install
```

### 2. Configurazione Database

#### Tabelle Necessarie
Le tabelle per l'integrazione Denea sono già incluse nel database schema:

- `denea_sync_mapping` - Mappatura SKU Denea ↔ Medusa
- `inventory_sync_log` - Log delle sincronizzazioni
- `product_extended` - Attributi estesi prodotti

### 3. Mappatura SKU

#### Creazione Mappatura
```bash
# Via API
curl -X POST http://localhost:9000/admin/denea-mapping \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "denea_sku": "COVER001",
    "medusa_variant_id": "variant_01HXXX",
    "denea_product_name": "Cover iPhone 15 Pro",
    "denea_category": "Accessori"
  }'
```

#### Import Mappature da CSV
```bash
# Crea file mapping.csv
echo "denea_sku,medusa_variant_id,denea_product_name,denea_category" > mapping.csv
echo "COVER001,variant_01HXXX,Cover iPhone 15 Pro,Accessori" >> mapping.csv

# Import via script
node scripts/import-mappings.js mapping.csv
```

## 🔄 Sincronizzazione

### 1. Sincronizzazione Manuale

#### Da File CSV
```bash
cd integrations

# Sincronizza da file CSV
npm run sync:csv path/to/products.csv

# O usando il comando diretto
node denea-sync.ts csv path/to/products.csv
```

#### Da File XML
```bash
# Sincronizza da file XML
npm run sync:xml path/to/products.xml

# O usando il comando diretto
node denea-sync.ts xml path/to/products.xml
```

#### Da API Denea
```bash
# Sincronizza da API
npm run sync:api

# O usando il comando diretto
node denea-sync.ts api
```

### 2. Sincronizzazione Automatica

#### Scheduler (Railway Cron)
```bash
# Avvia scheduler per sync ogni 5 minuti
npm run sync:schedule

# O usando il comando diretto
node denea-sync.ts schedule
```

#### Configurazione Cron (railway.json)
```json
{
  "cron": [
    {
      "name": "denea-sync",
      "schedule": "*/5 * * * *",
      "command": "npm run sync:api"
    },
    {
      "name": "cleanup-logs",
      "schedule": "0 2 * * *",
      "command": "npm run cleanup:logs"
    }
  ]
}
```

### 3. Webhook Real-time

#### Avvio Webhook Server
```bash
# Avvia server webhook
npm run webhook:start

# Server disponibile su http://localhost:3001
```

#### Configurazione Denea Webhook
Nel pannello Denea Easy FTT:
1. Vai su **Impostazioni > Webhook**
2. URL: `https://your-integration.railway.app/webhook/denea`
3. Secret: `your_denea_webhook_secret`
4. Eventi: `product.updated`, `inventory.changed`

#### Test Webhook
```bash
# Test webhook locale
curl -X POST http://localhost:3001/webhook/denea \
  -H "Content-Type: application/json" \
  -H "X-Denea-Signature: test_signature" \
  -d '{
    "updates": [
      {
        "sku": "COVER001",
        "stock": 45,
        "price": 18.99
      }
    ]
  }'
```

## 📊 Monitoring e Logging

### 1. Log Sincronizzazioni

#### Visualizza Log
```bash
# Via API
curl http://localhost:9000/admin/sync-log?limit=10

# Via database
psql $DATABASE_URL -c "
  SELECT sync_type, status, items_processed, items_success, items_error, created_at 
  FROM inventory_sync_log 
  ORDER BY created_at DESC 
  LIMIT 10;
"
```

#### Esempio Log
```json
{
  "logs": [
    {
      "id": "isl_01HXXX",
      "sync_type": "denea_import",
      "status": "success",
      "items_processed": 150,
      "items_success": 148,
      "items_error": 2,
      "started_at": "2024-01-15T10:30:00Z",
      "completed_at": "2024-01-15T10:35:00Z",
      "error_details": [
        {
          "sku": "INVALID001",
          "error": "Product variant not found"
        }
      ]
    }
  ]
}
```

### 2. Monitoring Dashboard

#### Webhook Server Status
```bash
# Health check
curl http://localhost:3001/health

# Status completo
curl http://localhost:3001/status
```

#### Metriche Sync
```bash
# Statistiche ultime 24h
curl http://localhost:9000/admin/sync-stats?period=24h
```

### 3. Alerts e Notifiche

#### Configurazione Alerts
```javascript
// webhook-server.ts
const alertThresholds = {
  errorRate: 0.1,        // 10% error rate
  syncDuration: 300000,  // 5 minuti max
  failedSyncs: 3         // 3 sync falliti consecutivi
}
```

#### Notifiche Email
```bash
# Configura SMTP per alerts
ALERT_EMAIL_FROM=alerts@cromos.com
ALERT_EMAIL_TO=admin@cromos.com
SMTP_HOST=smtp.brevo.com
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## 🔧 Personalizzazione

### 1. Mappatura Campi Custom

#### Estendi Mappatura
```typescript
// integrations/denea-sync.ts
private mapDeneaToMedusa(deneaItem: any): MappedProduct {
  return {
    sku: deneaItem.codice || deneaItem.sku,
    quantity: parseInt(deneaItem.giacenza || deneaItem.stock) || 0,
    price: parseFloat(deneaItem.prezzo || deneaItem.price) || 0,
    
    // Custom mappings
    phone_brand: this.extractPhoneBrand(deneaItem.marca),
    accessory_type: this.mapAccessoryType(deneaItem.categoria),
    compatibility: this.parseCompatibility(deneaItem.compatibilita)
  }
}

private extractPhoneBrand(marca: string): string {
  const brandMap = {
    'APPLE': 'Apple',
    'SAMSUNG': 'Samsung', 
    'XIAOMI': 'Xiaomi',
    'HUAWEI': 'Huawei'
  }
  return brandMap[marca?.toUpperCase()] || marca
}
```

### 2. Filtri e Validazioni

#### Filtri Pre-Sync
```typescript
private shouldSyncProduct(deneaProduct: DeneaProduct): boolean {
  // Skip prodotti senza SKU
  if (!deneaProduct.codice) return false
  
  // Skip prodotti con giacenza negativa
  if (deneaProduct.giacenza < 0) return false
  
  // Skip categorie escluse
  const excludedCategories = ['OBSOLETI', 'FUORI_PRODUZIONE']
  if (excludedCategories.includes(deneaProduct.categoria)) return false
  
  return true
}
```

#### Validazioni Custom
```typescript
private validateDeneaData(product: DeneaProduct): ValidationResult {
  const errors = []
  
  if (!product.codice || product.codice.length < 3) {
    errors.push('SKU troppo corto')
  }
  
  if (product.prezzo <= 0) {
    errors.push('Prezzo non valido')
  }
  
  if (!product.descrizione) {
    errors.push('Descrizione mancante')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
```

### 3. Trasformazioni Dati

#### Normalizzazione Prezzi
```typescript
private normalizePrice(price: any): number {
  // Gestisci diversi formati prezzo
  if (typeof price === 'string') {
    // Rimuovi simboli valuta e spazi
    price = price.replace(/[€$£,\s]/g, '').replace(',', '.')
  }
  
  const numPrice = parseFloat(price)
  
  // Converti in centesimi per Medusa
  return Math.round(numPrice * 100)
}
```

#### Gestione Immagini
```typescript
private async processProductImages(deneaProduct: DeneaProduct): Promise<string[]> {
  const imageUrls = []
  
  // Se Denea fornisce URL immagini
  if (deneaProduct.immagini) {
    for (const imgUrl of deneaProduct.immagini) {
      try {
        // Download e upload su Medusa
        const uploadedUrl = await this.uploadImageToMedusa(imgUrl)
        imageUrls.push(uploadedUrl)
      } catch (error) {
        console.warn(`Failed to process image: ${imgUrl}`)
      }
    }
  }
  
  return imageUrls
}
```

## 🧪 Testing

### 1. Test Unitari

#### Test Mappatura
```javascript
// tests/denea-sync.test.js
describe('Denea Sync Service', () => {
  test('should map Denea product correctly', () => {
    const deneaProduct = {
      codice: 'TEST001',
      descrizione: 'Test Product',
      giacenza: 10,
      prezzo: 19.99
    }
    
    const mapped = syncService.mapDeneaToMedusa(deneaProduct)
    
    expect(mapped.sku).toBe('TEST001')
    expect(mapped.quantity).toBe(10)
    expect(mapped.price).toBe(1999) // In centesimi
  })
})
```

### 2. Test Integrazione

#### Test Sync Completo
```bash
# Test con dati mock
npm run test:sync

# Test con file CSV di test
npm run test:csv tests/fixtures/test-products.csv

# Test webhook
npm run test:webhook
```

### 3. Test Performance

#### Load Test Sync
```javascript
// tests/performance/sync-load.test.js
describe('Sync Performance', () => {
  test('should handle 1000 products in under 5 minutes', async () => {
    const startTime = Date.now()
    const result = await syncService.syncProducts(mockProducts1000)
    const duration = Date.now() - startTime
    
    expect(duration).toBeLessThan(300000) // 5 minuti
    expect(result.success).toBe(true)
  })
})
```

## 🚨 Troubleshooting

### Problemi Comuni

#### 1. Errore Connessione Denea API
```bash
# Test connessione
curl -H "Authorization: Bearer $DENEA_API_KEY" $DENEA_API_URL/products

# Verifica certificati SSL
curl -I --ssl-no-revoke $DENEA_API_URL
```

#### 2. Mappature SKU Mancanti
```sql
-- Trova SKU Denea senza mappatura
SELECT DISTINCT denea_sku 
FROM inventory_sync_log 
WHERE error_details::text LIKE '%mapping not found%'
AND created_at > NOW() - INTERVAL '7 days';
```

#### 3. Sync Lenti
```bash
# Verifica performance database
psql $DATABASE_URL -c "
  SELECT query, mean_time, calls 
  FROM pg_stat_statements 
  WHERE query LIKE '%product%' 
  ORDER BY mean_time DESC 
  LIMIT 10;
"

# Ottimizza indici
psql $DATABASE_URL -c "
  CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_denea_sku 
  ON denea_sync_mapping(denea_sku);
"
```

#### 4. Webhook Non Ricevuti
```bash
# Verifica firewall
curl -X POST https://your-integration.railway.app/webhook/test

# Test da Denea (se possibile)
# Controlla logs webhook server
railway logs --service integration
```

### Debug Commands

```bash
# Logs dettagliati sync
DEBUG=denea:* npm run sync:api

# Test singolo prodotto
node -e "
const sync = require('./denea-sync');
sync.testSingleProduct('COVER001');
"

# Verifica mappature
psql $DATABASE_URL -c "
  SELECT dm.*, pv.sku, p.title 
  FROM denea_sync_mapping dm
  LEFT JOIN product_variant pv ON dm.medusa_variant_id = pv.id
  LEFT JOIN product p ON pv.product_id = p.id
  WHERE dm.mapping_status = 'active'
  LIMIT 10;
"
```

## 📈 Ottimizzazioni

### 1. Performance

#### Batch Processing
```typescript
// Processa in batch per evitare timeout
private async syncInBatches(products: DeneaProduct[], batchSize = 50) {
  const batches = this.chunkArray(products, batchSize)
  
  for (const batch of batches) {
    await this.processBatch(batch)
    await this.sleep(1000) // Pausa tra batch
  }
}
```

#### Connection Pooling
```typescript
// Pool connessioni database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000
})
```

### 2. Caching

#### Cache Mappature
```typescript
private mappingCache = new Map<string, MappingData>()

private async getCachedMapping(deneaSku: string): Promise<MappingData | null> {
  if (this.mappingCache.has(deneaSku)) {
    return this.mappingCache.get(deneaSku)!
  }
  
  const mapping = await this.fetchMappingFromDB(deneaSku)
  if (mapping) {
    this.mappingCache.set(deneaSku, mapping)
  }
  
  return mapping
}
```

### 3. Retry Logic

#### Exponential Backoff
```typescript
private async retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      
      const delay = Math.pow(2, i) * 1000 // 1s, 2s, 4s
      await this.sleep(delay)
    }
  }
  
  throw new Error('Max retries exceeded')
}
```

## 📞 Supporto

### Documentazione Denea
- [API Documentation](https://docs.denea.it/)
- [Webhook Guide](https://docs.denea.it/webhooks)
- [Support Portal](https://support.denea.it/)

### Cromos Integration
- GitHub Issues per bug report
- Email: integration@cromos.com
- Discord: #denea-integration

### Logs Utili
```bash
# Sync logs
railway logs --service integration --filter denea

# Database logs
psql $DATABASE_URL -c "SELECT * FROM inventory_sync_log ORDER BY created_at DESC LIMIT 5;"

# Webhook logs
curl http://localhost:3001/logs/webhook
```
