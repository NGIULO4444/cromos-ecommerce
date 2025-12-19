-- INIZIALIZZAZIONE MANUALE PAYMENT PROVIDERS
-- Soluzione per il bug "Empty criteria are not allowed for the update method"

-- Inserisci payment provider manual se non esiste
INSERT INTO payment_provider (id, is_installed) 
VALUES ('manual', true) 
ON CONFLICT (id) DO UPDATE SET is_installed = true;

-- Inserisci fulfillment provider manual se non esiste  
INSERT INTO fulfillment_provider (id, is_installed) 
VALUES ('manual', true) 
ON CONFLICT (id) DO UPDATE SET is_installed = true;

-- Crea store se non esiste
INSERT INTO store (id, name, default_currency_code, created_at, updated_at) 
VALUES ('store', 'Cromos E-commerce', 'eur', NOW(), NOW()) 
ON CONFLICT (id) DO NOTHING;

-- Crea currency EUR se non esiste
INSERT INTO currency (code, symbol, symbol_native, name, created_at, updated_at) 
VALUES ('eur', '€', '€', 'Euro', NOW(), NOW()) 
ON CONFLICT (code) DO NOTHING;

-- Crea country Italy se non esiste
INSERT INTO country (id, iso_2, iso_3, num_code, name, display_name, region_id, created_at, updated_at) 
VALUES (1, 'it', 'ita', 380, 'ITALY', 'Italy', NULL, NOW(), NOW()) 
ON CONFLICT (iso_2) DO NOTHING;

-- Crea region EU se non esiste
INSERT INTO region (id, name, currency_code, tax_rate, created_at, updated_at) 
VALUES ('reg_eu', 'EU', 'eur', 0, NOW(), NOW()) 
ON CONFLICT (id) DO NOTHING;

-- Collega country alla region
INSERT INTO country (id, iso_2, iso_3, num_code, name, display_name, region_id, created_at, updated_at) 
VALUES (1, 'it', 'ita', 380, 'ITALY', 'Italy', 'reg_eu', NOW(), NOW()) 
ON CONFLICT (iso_2) DO UPDATE SET region_id = 'reg_eu';

-- Collega payment provider alla region
INSERT INTO region_payment_providers (region_id, provider_id) 
VALUES ('reg_eu', 'manual') 
ON CONFLICT (region_id, provider_id) DO NOTHING;

-- Collega fulfillment provider alla region
INSERT INTO region_fulfillment_providers (region_id, provider_id) 
VALUES ('reg_eu', 'manual') 
ON CONFLICT (region_id, provider_id) DO NOTHING;
