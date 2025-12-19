# Deploy Spree su Dokploy

## 1. Configurazione Dokploy

### Crea Applicazione:
- **Type**: Docker Compose
- **Name**: `cromos-spree-backend`
- **Repository**: `https://github.com/NGIULO4444/cromos-ecommerce.git`
- **Branch**: `main`
- **Compose Path**: `cromos_spree/docker-compose.production.yml`

### Environment Variables:
```env
RAILS_ENV=production
DATABASE_URL=postgresql://neondb_owner:npg_FyaYW0qd5HZg@ep-sweet-voice-aga83jqy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
SECRET_KEY_BASE=your_generated_secret_key_here
RAILS_SERVE_STATIC_FILES=true
RAILS_LOG_TO_STDOUT=true
SPREE_FRONTEND_URL=https://cromos-ecommerce.vercel.app
ALLOWED_HOSTS=api.dev-solutions.it,cromos-ecommerce.vercel.app
```

### Domain Configuration:
- **Host**: `api.dev-solutions.it`
- **Service Name**: `spree`
- **Container Port**: `3000`
- **Path**: `/`

## 2. Genera Secret Key

```bash
cd cromos_spree
bundle exec rails secret
```

Copia il risultato e usalo come `SECRET_KEY_BASE`

## 3. Test Endpoints

Dopo il deploy:
- Health: `https://api.dev-solutions.it/health`
- API: `https://api.dev-solutions.it/api/v2/storefront/products`
- Admin: `https://api.dev-solutions.it/admin`

## 4. Admin Credentials

- **Email**: angelosann0@gmail.com
- **Password**: callenger
