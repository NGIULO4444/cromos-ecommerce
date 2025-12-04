# Cromos E-commerce - API Reference

Documentazione completa delle API REST per il backend Cromos.

## 📖 Overview

Il backend Cromos è basato su **Medusa.js** con estensioni custom per:
- Gestione accessori telefonia
- Integrazione Denea Easy FTT
- Sincronizzazione magazzino
- Webhook real-time

**Base URL**: `http://localhost:9000` (dev) | `https://your-backend.railway.app` (prod)

## 🔐 Autenticazione

### Customer Authentication
```http
POST /store/auth
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123"
}
```

### Admin Authentication
```http
POST /admin/auth
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 🛍️ Store API (Public)

### Products

#### Get All Products
```http
GET /store/products
```

**Query Parameters**:
- `limit` (number): Numero prodotti per pagina (default: 20)
- `offset` (number): Offset per paginazione (default: 0)
- `q` (string): Ricerca testuale
- `category_id[]` (string[]): Filtra per categorie
- `collection_id[]` (string[]): Filtra per collezioni
- `tags[]` (string[]): Filtra per tag

**Example**:
```bash
curl "http://localhost:9000/store/products?limit=10&q=iPhone&category_id[]=pcat_covers"
```

**Response**:
```json
{
  "products": [
    {
      "id": "prod_01HXXX",
      "title": "Cover iPhone 15 Pro",
      "description": "Cover protettiva in silicone",
      "handle": "cover-iphone-15-pro",
      "thumbnail": "/uploads/cover-iphone.jpg",
      "variants": [
        {
          "id": "variant_01HXXX",
          "title": "Nero / Default",
          "sku": "COVER-IP15P-BLK",
          "inventory_quantity": 50,
          "prices": [
            {
              "amount": 1999,
              "currency_code": "EUR"
            }
          ]
        }
      ],
      "images": [
        {
          "id": "img_01HXXX",
          "url": "/uploads/cover-iphone-1.jpg"
        }
      ],
      "extended": {
        "phone_brand": "Apple",
        "phone_model": "iPhone 15 Pro",
        "accessory_type": "cover",
        "material": "silicone",
        "color": "nero",
        "wireless_charging_compatible": true
      }
    }
  ],
  "count": 1,
  "offset": 0,
  "limit": 20
}
```

#### Get Single Product
```http
GET /store/products/:id
```

**Example**:
```bash
curl "http://localhost:9000/store/products/prod_01HXXX"
```

#### Get Product by Handle
```http
GET /store/products?handle=cover-iphone-15-pro
```

### Categories

#### Get All Categories
```http
GET /store/product-categories
```

**Response**:
```json
{
  "product_categories": [
    {
      "id": "pcat_covers",
      "name": "Cover e Custodie",
      "handle": "cover-custodie",
      "parent_category_id": null,
      "category_children": []
    }
  ]
}
```

### Cart Management

#### Create Cart
```http
POST /store/carts
Content-Type: application/json

{
  "region_id": "reg_italy"
}
```

#### Get Cart
```http
GET /store/carts/:cart_id
```

#### Add Item to Cart
```http
POST /store/carts/:cart_id/line-items
Content-Type: application/json

{
  "variant_id": "variant_01HXXX",
  "quantity": 2
}
```

#### Update Cart Item
```http
POST /store/carts/:cart_id/line-items/:item_id
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove Cart Item
```http
DELETE /store/carts/:cart_id/line-items/:item_id
```

### Checkout

#### Add Shipping Address
```http
POST /store/carts/:cart_id/shipping-address
Content-Type: application/json

{
  "first_name": "Mario",
  "last_name": "Rossi",
  "address_1": "Via Roma 123",
  "city": "Milano",
  "country_code": "IT",
  "postal_code": "20100",
  "phone": "+39 123 456 7890"
}
```

#### Get Shipping Options
```http
GET /store/shipping-options/:cart_id
```

#### Add Shipping Method
```http
POST /store/carts/:cart_id/shipping-methods
Content-Type: application/json

{
  "option_id": "so_01HXXX"
}
```

#### Create Payment Sessions
```http
POST /store/carts/:cart_id/payment-sessions
```

#### Complete Cart
```http
POST /store/carts/:cart_id/complete
```

### Customer

#### Register Customer
```http
POST /store/customers
Content-Type: application/json

{
  "first_name": "Mario",
  "last_name": "Rossi",
  "email": "mario.rossi@example.com",
  "password": "password123",
  "phone": "+39 123 456 7890"
}
```

#### Get Customer Orders
```http
GET /store/customers/me/orders
Authorization: Bearer <customer_token>
```

### Inventory Check (Custom)

#### Check Single Product
```http
GET /store/inventory/check?sku=COVER-IP15P-BLK
```

**Response**:
```json
{
  "sku": "COVER-IP15P-BLK",
  "variant_id": "variant_01HXXX",
  "available": true,
  "quantity": 45,
  "total_quantity": 50,
  "reserved_quantity": 5,
  "location_id": "default_location"
}
```

#### Bulk Inventory Check
```http
POST /store/inventory/check
Content-Type: application/json

{
  "items": [
    {
      "sku": "COVER-IP15P-BLK",
      "quantity": 2
    },
    {
      "variant_id": "variant_01HYYY",
      "quantity": 1
    }
  ]
}
```

## 🔧 Admin API (Private)

### Products Management

#### Create Product
```http
POST /admin/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Cover iPhone 15 Pro Max",
  "description": "Cover protettiva premium",
  "type": {
    "value": "Phone Case"
  },
  "collection_id": "pcol_covers",
  "categories": [
    {
      "id": "pcat_covers"
    }
  ],
  "variants": [
    {
      "title": "Nero / Default",
      "sku": "COVER-IP15PM-BLK",
      "inventory_quantity": 100,
      "prices": [
        {
          "currency_code": "EUR",
          "amount": 2499
        }
      ]
    }
  ]
}
```

#### Update Product Extended
```http
PUT /admin/products/:product_id/extended
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "phone_brand": "Apple",
  "phone_model": "iPhone 15 Pro Max",
  "accessory_type": "cover",
  "material": "leather",
  "color": "nero",
  "wireless_charging_compatible": true,
  "is_featured": true,
  "seo_title": "Cover iPhone 15 Pro Max in Pelle Nera",
  "seo_description": "Cover premium per iPhone 15 Pro Max"
}
```

### Inventory Management (Custom)

#### Sync Inventory
```http
POST /admin/inventory/sync
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "items": [
    {
      "sku": "COVER-IP15P-BLK",
      "quantity": 75,
      "location_id": "default_location"
    },
    {
      "sku": "COVER-IP15P-WHT",
      "quantity": 30,
      "location_id": "default_location"
    }
  ]
}
```

**Response**:
```json
{
  "message": "Inventory sync completed",
  "results": [
    {
      "sku": "COVER-IP15P-BLK",
      "success": true,
      "updated_quantity": 75
    },
    {
      "sku": "COVER-IP15P-WHT",
      "success": true,
      "updated_quantity": 30
    }
  ],
  "total_processed": 2,
  "successful": 2,
  "failed": 0
}
```

#### Update Single Inventory
```http
PUT /admin/inventory/update
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "sku": "COVER-IP15P-BLK",
  "quantity": 80,
  "adjustment_type": "set"
}
```

**Adjustment Types**:
- `set`: Imposta quantità assoluta
- `increment`: Incrementa quantità
- `decrement`: Decrementa quantità

### Denea Integration

#### Get Sync Mappings
```http
GET /admin/denea-mapping
Authorization: Bearer <admin_token>
```

#### Create Sync Mapping
```http
POST /admin/denea-mapping
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "denea_sku": "DENEA123",
  "medusa_variant_id": "variant_01HXXX",
  "denea_product_name": "Cover iPhone Denea",
  "denea_category": "Accessori"
}
```

#### Get Sync Logs
```http
GET /admin/sync-log?limit=50&sync_type=denea_import
Authorization: Bearer <admin_token>
```

**Response**:
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
          "sku": "DENEA999",
          "error": "Product variant not found"
        }
      ]
    }
  ]
}
```

## 🔄 Webhook Endpoints

### Stripe Webhooks
```http
POST /hooks/stripe
```

### Denea Webhooks (Custom)
```http
POST /webhook/denea
X-Denea-Signature: <signature>
Content-Type: application/json

{
  "updates": [
    {
      "sku": "DENEA123",
      "stock": 45,
      "price": 19.99
    }
  ]
}
```

## 📊 Analytics & Reporting

### Sales Report
```http
GET /admin/analytics/sales?start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer <admin_token>
```

### Inventory Report
```http
GET /admin/analytics/inventory?low_stock_threshold=10
Authorization: Bearer <admin_token>
```

### Top Products
```http
GET /admin/analytics/products/top?limit=10&period=30d
Authorization: Bearer <admin_token>
```

## 🚨 Error Handling

### Error Response Format
```json
{
  "type": "invalid_data",
  "message": "The provided data is invalid",
  "code": "INVALID_DATA"
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_DATA` | 400 | Dati richiesta non validi |
| `NOT_FOUND` | 404 | Risorsa non trovata |
| `UNAUTHORIZED` | 401 | Token non valido |
| `FORBIDDEN` | 403 | Accesso negato |
| `RATE_LIMITED` | 429 | Troppo richieste |
| `INTERNAL_ERROR` | 500 | Errore interno server |

## 📈 Rate Limiting

### Limiti per IP

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Store API | 1000 req | 15 min |
| Admin API | 500 req | 15 min |
| Auth API | 10 req | 15 min |
| Inventory Sync | 100 req | 5 min |

### Headers Response
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
```

## 🧪 Testing

### Postman Collection
Importa la collection Postman: `docs/postman/cromos-api.json`

### cURL Examples

#### Complete Order Flow
```bash
# 1. Create cart
CART_ID=$(curl -X POST http://localhost:9000/store/carts \
  -H "Content-Type: application/json" \
  -d '{"region_id":"reg_italy"}' | jq -r '.cart.id')

# 2. Add item
curl -X POST http://localhost:9000/store/carts/$CART_ID/line-items \
  -H "Content-Type: application/json" \
  -d '{"variant_id":"variant_01HXXX","quantity":1}'

# 3. Add shipping address
curl -X POST http://localhost:9000/store/carts/$CART_ID/shipping-address \
  -H "Content-Type: application/json" \
  -d '{
    "first_name":"Mario",
    "last_name":"Rossi",
    "address_1":"Via Roma 123",
    "city":"Milano",
    "country_code":"IT",
    "postal_code":"20100"
  }'

# 4. Complete cart
curl -X POST http://localhost:9000/store/carts/$CART_ID/complete
```

### Test Data

#### Sample Product
```json
{
  "title": "Cover iPhone 15 Pro Test",
  "handle": "cover-iphone-15-pro-test",
  "description": "Cover di test per sviluppo",
  "variants": [
    {
      "title": "Test Variant",
      "sku": "TEST-COVER-001",
      "inventory_quantity": 999,
      "prices": [{"currency_code": "EUR", "amount": 1000}]
    }
  ]
}
```

## 🔍 Monitoring

### Health Check
```http
GET /health
```

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "database": "connected",
  "redis": "connected"
}
```

### Metrics
```http
GET /admin/metrics
Authorization: Bearer <admin_token>
```

## 📚 SDK & Libraries

### JavaScript/TypeScript
```bash
npm install @medusajs/medusa-js
```

```javascript
import Medusa from "@medusajs/medusa-js"

const medusa = new Medusa({
  baseUrl: "http://localhost:9000",
  maxRetries: 3,
})

// Get products
const products = await medusa.products.list()

// Add to cart
const cart = await medusa.carts.lineItems.create(cartId, {
  variant_id: "variant_01HXXX",
  quantity: 1
})
```

### Python
```bash
pip install python-medusa
```

```python
from medusa import Medusa

client = Medusa(base_url="http://localhost:9000")
products = client.products.list()
```

## 🔗 Useful Links

- [Medusa.js Documentation](https://docs.medusajs.com/)
- [Stripe API Reference](https://stripe.com/docs/api)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
