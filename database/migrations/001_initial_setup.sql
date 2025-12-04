-- Migration 001: Initial Cromos Setup
-- Creazione tabelle custom e dati iniziali

BEGIN;

-- Crea le tabelle custom se non esistono
CREATE TABLE IF NOT EXISTS phone_accessorie_category (
    id VARCHAR PRIMARY KEY DEFAULT 'pac_' || substr(md5(random()::text), 1, 27),
    name VARCHAR NOT NULL,
    description TEXT,
    phone_brand VARCHAR,
    phone_model VARCHAR,
    accessory_type VARCHAR,
    compatibility TEXT,
    material VARCHAR,
    color VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    category_id VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS product_extended (
    id VARCHAR PRIMARY KEY DEFAULT 'pext_' || substr(md5(random()::text), 1, 26),
    product_id VARCHAR NOT NULL,
    phone_brand VARCHAR,
    phone_model VARCHAR,
    compatibility TEXT,
    accessory_type VARCHAR,
    material VARCHAR,
    color VARCHAR,
    size VARCHAR,
    wireless_charging_compatible BOOLEAN DEFAULT FALSE,
    connector_type VARCHAR,
    cable_length VARCHAR,
    power_output VARCHAR,
    fast_charging BOOLEAN DEFAULT FALSE,
    screen_size VARCHAR,
    protection_level VARCHAR,
    denea_sku VARCHAR,
    denea_category VARCHAR,
    supplier_code VARCHAR,
    cost_price DECIMAL(10,2),
    margin_percentage DECIMAL(5,2),
    last_sync_at TIMESTAMP WITH TIME ZONE,
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

CREATE TABLE IF NOT EXISTS inventory_sync_log (
    id VARCHAR PRIMARY KEY DEFAULT 'isl_' || substr(md5(random()::text), 1, 27),
    sync_type VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    items_processed INTEGER DEFAULT 0,
    items_success INTEGER DEFAULT 0,
    items_error INTEGER DEFAULT 0,
    error_details JSONB,
    sync_data JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS denea_sync_mapping (
    id VARCHAR PRIMARY KEY DEFAULT 'dsm_' || substr(md5(random()::text), 1, 27),
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

-- Crea gli indici
CREATE INDEX IF NOT EXISTS idx_product_extended_product ON product_extended(product_id);
CREATE INDEX IF NOT EXISTS idx_product_extended_phone_brand ON product_extended(phone_brand);
CREATE INDEX IF NOT EXISTS idx_product_extended_accessory_type ON product_extended(accessory_type);
CREATE INDEX IF NOT EXISTS idx_product_extended_denea_sku ON product_extended(denea_sku);
CREATE INDEX IF NOT EXISTS idx_product_extended_featured ON product_extended(is_featured);

CREATE INDEX IF NOT EXISTS idx_denea_mapping_sku ON denea_sync_mapping(denea_sku);
CREATE INDEX IF NOT EXISTS idx_denea_mapping_variant ON denea_sync_mapping(medusa_variant_id);
CREATE INDEX IF NOT EXISTS idx_denea_mapping_status ON denea_sync_mapping(mapping_status);

CREATE INDEX IF NOT EXISTS idx_sync_log_type ON inventory_sync_log(sync_type);
CREATE INDEX IF NOT EXISTS idx_sync_log_status ON inventory_sync_log(status);
CREATE INDEX IF NOT EXISTS idx_sync_log_created_at ON inventory_sync_log(created_at);

-- Inserisci dati di esempio per le categorie accessori telefonia
INSERT INTO phone_accessorie_category (name, description, phone_brand, accessory_type, is_active, sort_order) VALUES
('Cover iPhone', 'Cover e custodie per iPhone', 'Apple', 'cover', TRUE, 1),
('Cover Samsung', 'Cover e custodie per Samsung Galaxy', 'Samsung', 'cover', TRUE, 2),
('Cover Xiaomi', 'Cover e custodie per Xiaomi', 'Xiaomi', 'cover', TRUE, 3),
('Pellicole iPhone', 'Pellicole protettive per iPhone', 'Apple', 'screen_protector', TRUE, 4),
('Pellicole Samsung', 'Pellicole protettive per Samsung', 'Samsung', 'screen_protector', TRUE, 5),
('Caricatori Wireless', 'Caricatori wireless universali', NULL, 'charger', TRUE, 6),
('Cavi Lightning', 'Cavi Lightning per iPhone', 'Apple', 'cable', TRUE, 7),
('Cavi USB-C', 'Cavi USB-C universali', NULL, 'cable', TRUE, 8)
ON CONFLICT DO NOTHING;

COMMIT;
