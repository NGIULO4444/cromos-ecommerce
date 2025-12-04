-- Cromos E-commerce Database Schema
-- PostgreSQL Schema per Medusa.js con estensioni custom

-- =============================================
-- MEDUSA CORE TABLES (Principali)
-- =============================================

-- Regions (Regioni geografiche)
CREATE TABLE IF NOT EXISTS region (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    tax_rate REAL DEFAULT 0,
    tax_code VARCHAR,
    gift_cards_taxable BOOLEAN DEFAULT TRUE,
    automatic_taxes BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Countries (Paesi)
CREATE TABLE IF NOT EXISTS country (
    id SERIAL PRIMARY KEY,
    iso_2 VARCHAR(2) NOT NULL UNIQUE,
    iso_3 VARCHAR(3) NOT NULL UNIQUE,
    num_code INTEGER NOT NULL,
    name VARCHAR NOT NULL,
    display_name VARCHAR NOT NULL,
    region_id VARCHAR REFERENCES region(id)
);

-- Customers (Clienti)
CREATE TABLE IF NOT EXISTS customer (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR,
    last_name VARCHAR,
    billing_address_id VARCHAR,
    phone VARCHAR,
    has_account BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Addresses (Indirizzi)
CREATE TABLE IF NOT EXISTS address (
    id VARCHAR PRIMARY KEY,
    customer_id VARCHAR REFERENCES customer(id),
    company VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    address_1 VARCHAR,
    address_2 VARCHAR,
    city VARCHAR,
    country_code VARCHAR(2),
    province VARCHAR,
    postal_code VARCHAR,
    phone VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Product Collections (Collezioni)
CREATE TABLE IF NOT EXISTS product_collection (
    id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    handle VARCHAR UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Product Categories (Categorie)
CREATE TABLE IF NOT EXISTS product_category (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    handle VARCHAR UNIQUE,
    parent_category_id VARCHAR REFERENCES product_category(id),
    mpath VARCHAR,
    is_active BOOLEAN DEFAULT FALSE,
    is_internal BOOLEAN DEFAULT FALSE,
    rank INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Product Types (Tipi di prodotto)
CREATE TABLE IF NOT EXISTS product_type (
    id VARCHAR PRIMARY KEY,
    value VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Product Tags (Tag prodotti)
CREATE TABLE IF NOT EXISTS product_tag (
    id VARCHAR PRIMARY KEY,
    value VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Products (Prodotti)
CREATE TABLE IF NOT EXISTS product (
    id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    subtitle VARCHAR,
    description TEXT,
    handle VARCHAR UNIQUE,
    is_giftcard BOOLEAN DEFAULT FALSE,
    status VARCHAR DEFAULT 'draft',
    thumbnail VARCHAR,
    profile_id VARCHAR NOT NULL,
    weight INTEGER,
    length INTEGER,
    height INTEGER,
    width INTEGER,
    hs_code VARCHAR,
    origin_country VARCHAR(2),
    mid_code VARCHAR,
    material VARCHAR,
    collection_id VARCHAR REFERENCES product_collection(id),
    type_id VARCHAR REFERENCES product_type(id),
    discountable BOOLEAN DEFAULT TRUE,
    external_id VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Product Images (Immagini prodotto)
CREATE TABLE IF NOT EXISTS image (
    id VARCHAR PRIMARY KEY,
    url VARCHAR NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Product Options (Opzioni prodotto - es. colore, taglia)
CREATE TABLE IF NOT EXISTS product_option (
    id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    product_id VARCHAR NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Product Option Values (Valori opzioni)
CREATE TABLE IF NOT EXISTS product_option_value (
    id VARCHAR PRIMARY KEY,
    value VARCHAR NOT NULL,
    option_id VARCHAR NOT NULL REFERENCES product_option(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Product Variants (Varianti prodotto)
CREATE TABLE IF NOT EXISTS product_variant (
    id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL,
    product_id VARCHAR NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    sku VARCHAR,
    barcode VARCHAR,
    ean VARCHAR,
    upc VARCHAR,
    variant_rank INTEGER DEFAULT 0,
    inventory_quantity INTEGER DEFAULT 0,
    allow_backorder BOOLEAN DEFAULT FALSE,
    manage_inventory BOOLEAN DEFAULT TRUE,
    hs_code VARCHAR,
    origin_country VARCHAR(2),
    mid_code VARCHAR,
    material VARCHAR,
    weight INTEGER,
    length INTEGER,
    height INTEGER,
    width INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Money Amounts (Prezzi)
CREATE TABLE IF NOT EXISTS money_amount (
    id VARCHAR PRIMARY KEY,
    currency_code VARCHAR(3) NOT NULL,
    amount INTEGER NOT NULL,
    min_quantity INTEGER,
    max_quantity INTEGER,
    price_list_id VARCHAR,
    variant_id VARCHAR REFERENCES product_variant(id) ON DELETE CASCADE,
    region_id VARCHAR REFERENCES region(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Carts (Carrelli)
CREATE TABLE IF NOT EXISTS cart (
    id VARCHAR PRIMARY KEY,
    email VARCHAR,
    billing_address_id VARCHAR REFERENCES address(id),
    shipping_address_id VARCHAR REFERENCES address(id),
    region_id VARCHAR NOT NULL REFERENCES region(id),
    customer_id VARCHAR REFERENCES customer(id),
    payment_id VARCHAR,
    type VARCHAR DEFAULT 'default',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Line Items (Articoli nel carrello/ordine)
CREATE TABLE IF NOT EXISTS line_item (
    id VARCHAR PRIMARY KEY,
    cart_id VARCHAR REFERENCES cart(id) ON DELETE CASCADE,
    order_id VARCHAR,
    swap_id VARCHAR,
    claim_order_id VARCHAR,
    tax_line_id VARCHAR,
    original_item_id VARCHAR,
    order_edit_id VARCHAR,
    variant_id VARCHAR REFERENCES product_variant(id),
    title VARCHAR NOT NULL,
    description TEXT,
    thumbnail VARCHAR,
    is_return BOOLEAN DEFAULT FALSE,
    is_giftcard BOOLEAN DEFAULT FALSE,
    should_merge BOOLEAN DEFAULT TRUE,
    allow_discounts BOOLEAN DEFAULT TRUE,
    has_shipping BOOLEAN,
    unit_price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    fulfilled_quantity INTEGER,
    returned_quantity INTEGER,
    shipped_quantity INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Orders (Ordini)
CREATE TABLE IF NOT EXISTS "order" (
    id VARCHAR PRIMARY KEY,
    status VARCHAR DEFAULT 'pending',
    fulfillment_status VARCHAR DEFAULT 'not_fulfilled',
    payment_status VARCHAR DEFAULT 'not_paid',
    display_id SERIAL,
    cart_id VARCHAR REFERENCES cart(id),
    customer_id VARCHAR NOT NULL REFERENCES customer(id),
    email VARCHAR NOT NULL,
    billing_address_id VARCHAR REFERENCES address(id),
    shipping_address_id VARCHAR REFERENCES address(id),
    region_id VARCHAR NOT NULL REFERENCES region(id),
    currency_code VARCHAR(3) NOT NULL,
    tax_rate REAL,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    no_notification BOOLEAN,
    idempotency_key VARCHAR,
    draft_order_id VARCHAR,
    sales_channel_id VARCHAR
);

-- =============================================
-- CROMOS CUSTOM EXTENSIONS
-- =============================================

-- Phone Accessorie Categories (Categorie accessori telefonia)
CREATE TABLE IF NOT EXISTS phone_accessorie_category (
    id VARCHAR PRIMARY KEY DEFAULT 'pac_' || substr(md5(random()::text), 1, 27),
    name VARCHAR NOT NULL,
    description TEXT,
    phone_brand VARCHAR, -- Apple, Samsung, Xiaomi, etc.
    phone_model VARCHAR, -- iPhone 15, Galaxy S24, etc.
    accessory_type VARCHAR, -- cover, screen_protector, charger, etc.
    compatibility TEXT, -- Modelli compatibili
    material VARCHAR, -- silicone, leather, glass, etc.
    color VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    category_id VARCHAR REFERENCES product_category(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Product Extended (Estensioni prodotto per telefonia)
CREATE TABLE IF NOT EXISTS product_extended (
    id VARCHAR PRIMARY KEY DEFAULT 'pext_' || substr(md5(random()::text), 1, 26),
    product_id VARCHAR NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    
    -- Attributi specifici per telefonia
    phone_brand VARCHAR, -- Apple, Samsung, Xiaomi, etc.
    phone_model VARCHAR, -- iPhone 15 Pro, Galaxy S24 Ultra, etc.
    compatibility TEXT, -- Lista modelli compatibili separati da virgola
    accessory_type VARCHAR, -- cover, screen_protector, charger, cable, etc.
    material VARCHAR, -- silicone, leather, glass, plastic, metal
    color VARCHAR,
    size VARCHAR, -- Per cover: slim, rugged, etc.
    wireless_charging_compatible BOOLEAN DEFAULT FALSE,
    connector_type VARCHAR, -- USB-C, Lightning, Micro-USB
    cable_length VARCHAR, -- 1m, 2m, 3m
    power_output VARCHAR, -- 20W, 65W, etc.
    fast_charging BOOLEAN DEFAULT FALSE,
    screen_size VARCHAR, -- Per screen protector
    protection_level VARCHAR, -- 9H, military grade, etc.
    
    -- Attributi Denea
    denea_sku VARCHAR, -- SKU nel gestionale Denea
    denea_category VARCHAR,
    supplier_code VARCHAR,
    cost_price DECIMAL(10,2),
    margin_percentage DECIMAL(5,2),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    
    -- SEO e Marketing
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords VARCHAR,
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(product_id)
);

-- Inventory Sync Log (Log sincronizzazioni magazzino)
CREATE TABLE IF NOT EXISTS inventory_sync_log (
    id VARCHAR PRIMARY KEY DEFAULT 'isl_' || substr(md5(random()::text), 1, 27),
    sync_type VARCHAR NOT NULL, -- 'denea_import', 'manual_update', 'webhook'
    status VARCHAR NOT NULL, -- 'success', 'error', 'partial'
    items_processed INTEGER DEFAULT 0,
    items_success INTEGER DEFAULT 0,
    items_error INTEGER DEFAULT 0,
    error_details JSONB,
    sync_data JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Denea Sync Mapping (Mappatura SKU Denea -> Medusa)
CREATE TABLE IF NOT EXISTS denea_sync_mapping (
    id VARCHAR PRIMARY KEY DEFAULT 'dsm_' || substr(md5(random()::text), 1, 27),
    denea_sku VARCHAR NOT NULL UNIQUE,
    medusa_variant_id VARCHAR NOT NULL REFERENCES product_variant(id),
    denea_product_name VARCHAR,
    denea_category VARCHAR,
    mapping_status VARCHAR DEFAULT 'active', -- 'active', 'inactive', 'error'
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_errors JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES per Performance
-- =============================================

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_product_handle ON product(handle);
CREATE INDEX IF NOT EXISTS idx_product_status ON product(status);
CREATE INDEX IF NOT EXISTS idx_product_collection ON product(collection_id);
CREATE INDEX IF NOT EXISTS idx_product_type ON product(type_id);
CREATE INDEX IF NOT EXISTS idx_product_created_at ON product(created_at);

-- Product Variant indexes
CREATE INDEX IF NOT EXISTS idx_variant_product_id ON product_variant(product_id);
CREATE INDEX IF NOT EXISTS idx_variant_sku ON product_variant(sku);
CREATE INDEX IF NOT EXISTS idx_variant_inventory ON product_variant(inventory_quantity);

-- Money Amount indexes
CREATE INDEX IF NOT EXISTS idx_money_amount_variant ON money_amount(variant_id);
CREATE INDEX IF NOT EXISTS idx_money_amount_region ON money_amount(region_id);
CREATE INDEX IF NOT EXISTS idx_money_amount_currency ON money_amount(currency_code);

-- Cart indexes
CREATE INDEX IF NOT EXISTS idx_cart_customer ON cart(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_region ON cart(region_id);
CREATE INDEX IF NOT EXISTS idx_cart_created_at ON cart(created_at);

-- Line Item indexes
CREATE INDEX IF NOT EXISTS idx_line_item_cart ON line_item(cart_id);
CREATE INDEX IF NOT EXISTS idx_line_item_variant ON line_item(variant_id);
CREATE INDEX IF NOT EXISTS idx_line_item_order ON line_item(order_id);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_order_customer ON "order"(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_status ON "order"(status);
CREATE INDEX IF NOT EXISTS idx_order_created_at ON "order"(created_at);
CREATE INDEX IF NOT EXISTS idx_order_display_id ON "order"(display_id);

-- Custom indexes
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

-- =============================================
-- SAMPLE DATA per Testing
-- =============================================

-- Insert default region (Italia)
INSERT INTO region (id, name, currency_code, tax_rate) 
VALUES ('reg_italy', 'Italia', 'EUR', 0.22) 
ON CONFLICT (id) DO NOTHING;

-- Insert Italy country
INSERT INTO country (iso_2, iso_3, num_code, name, display_name, region_id)
VALUES ('IT', 'ITA', 380, 'Italy', 'Italia', 'reg_italy')
ON CONFLICT (iso_2) DO NOTHING;

-- Insert sample product categories
INSERT INTO product_category (id, name, handle, is_active) VALUES
('pcat_covers', 'Cover e Custodie', 'cover-custodie', TRUE),
('pcat_screen_protectors', 'Pellicole Protettive', 'pellicole-protettive', TRUE),
('pcat_chargers', 'Caricatori', 'caricatori', TRUE),
('pcat_cables', 'Cavi', 'cavi', TRUE),
('pcat_accessories', 'Altri Accessori', 'altri-accessori', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Insert sample product types
INSERT INTO product_type (id, value) VALUES
('ptyp_phone_case', 'Phone Case'),
('ptyp_screen_protector', 'Screen Protector'),
('ptyp_charger', 'Charger'),
('ptyp_cable', 'Cable'),
('ptyp_accessory', 'Accessory')
ON CONFLICT (id) DO NOTHING;
