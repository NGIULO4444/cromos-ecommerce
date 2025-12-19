# Cromos E-commerce - Spree Backend

Backend e-commerce basato su Spree Commerce per il progetto Cromos.

## 🚀 Quick Start

### Sviluppo Locale

```bash
# Installa dipendenze
bundle install

# Setup database
rails db:create db:migrate db:seed

# Avvia server
bin/dev
```

### Accesso

- **Storefront**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:3000/api/v2/storefront

### Credenziali Admin

- **Email**: angelosann0@gmail.com
- **Password**: callenger

## 📦 Deploy Produzione

Vedi [deploy-dokploy.md](./deploy-dokploy.md) per istruzioni complete.

### Environment Variables

Copia `env.production.example` e configura:

```bash
DATABASE_URL=your_neon_postgresql_url
SECRET_KEY_BASE=your_generated_secret
```

### Docker

```bash
# Build
docker build -t cromos-spree .

# Run
docker run -p 3000:3000 --env-file .env cromos-spree
```

## 🔗 API Endpoints

### Storefront API

- `GET /api/v2/storefront/products` - Lista prodotti
- `GET /api/v2/storefront/products/:id` - Dettaglio prodotto
- `POST /api/v2/storefront/cart` - Crea carrello
- `POST /api/v2/storefront/checkout` - Checkout

### Admin API

- `GET /api/v2/platform/products` - Gestione prodotti
- `GET /api/v2/platform/orders` - Gestione ordini

Documentazione completa: https://spreecommerce.org/docs/api

## 🛠️ Tech Stack

- **Framework**: Ruby on Rails 8
- **E-commerce**: Spree Commerce 5.2
- **Database**: PostgreSQL (Neon)
- **Deployment**: Docker + Dokploy

## 📚 Documentazione

- [Spree Developer Docs](https://spreecommerce.org/docs/developer)
- [Spree API Reference](https://spreecommerce.org/docs/api)
- [Deploy Guide](./deploy-dokploy.md)
