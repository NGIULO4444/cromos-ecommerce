# Cromos E-commerce - Deploy Guide

Guida completa per il deploy in produzione su Vercel (Frontend) e Railway (Backend).

## 🎯 Architettura Deploy

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Vercel)      │◄──►│   (Railway)     │◄──►│    (Neon)       │
│   Next.js 14    │    │   Medusa.js     │    │  PostgreSQL     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │  Integration    │              │
         └──────────────►│   (Railway)     │◄─────────────┘
                        │ Denea Webhook   │
                        └─────────────────┘
```

## 📋 Prerequisiti Deploy

### Account Necessari
- ✅ **Vercel Account** - [Signup](https://vercel.com/)
- ✅ **Railway Account** - [Signup](https://railway.app/)
- ✅ **Neon Account** - [Signup](https://neon.tech/)
- ✅ **GitHub Repository** - Per CI/CD automatico

### CLI Tools
```bash
# Vercel CLI
npm install -g vercel

# Railway CLI
npm install -g @railway/cli

# Git (per CI/CD)
git --version
```

## 🗄️ 1. Setup Database (Neon)

### Creazione Database

1. **Login su Neon**
   ```
   https://console.neon.tech/
   ```

2. **Crea Nuovo Progetto**
   - Nome: `cromos-production`
   - Regione: `US East (Ohio)` o `Europe (Frankfurt)`
   - PostgreSQL Version: `15`

3. **Ottieni Connection String**
   ```
   postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/cromos_db?sslmode=require
   ```

4. **Configura Database**
   ```bash
   # Esegui migrazioni
   psql "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/cromos_db?sslmode=require" -f database/schema.sql
   
   # Esegui setup custom
   psql "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/cromos_db?sslmode=require" -f database/migrations/001_initial_setup.sql
   ```

### Configurazione Sicurezza

1. **IP Allowlist** (se necessario)
   - Neon Dashboard > Settings > IP Allow
   - Aggiungi IP Railway: `0.0.0.0/0` (o specifici)

2. **Connection Pooling**
   - Abilita pooling per performance
   - Max connections: 100

## 🚀 2. Deploy Backend (Railway)

### Setup Automatico

```bash
# Usa lo script automatico
./scripts/deploy-backend.sh
```

### Setup Manuale

#### 1. Login Railway
```bash
railway login
```

#### 2. Inizializza Progetto
```bash
cd backend
railway init
```

#### 3. Configura Variabili
```bash
# Carica tutte le variabili da .env
railway variables set DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/cromos_db?sslmode=require"
railway variables set JWT_SECRET="your-super-secret-jwt-key"
railway variables set COOKIE_SECRET="your-super-secret-cookie-key"
railway variables set STRIPE_API_KEY="sk_live_your_stripe_key"
railway variables set STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
railway variables set SENDGRID_API_KEY="your_sendgrid_key"
railway variables set SENDGRID_FROM="noreply@yourdomain.com"
railway variables set NODE_ENV="production"
railway variables set PORT="9000"
railway variables set HOST="0.0.0.0"

# CORS per produzione
railway variables set STORE_CORS="https://your-frontend-domain.vercel.app"
railway variables set ADMIN_CORS="https://your-admin-domain.vercel.app"
```

#### 4. Deploy
```bash
railway up
```

#### 5. Configura Dominio
```bash
# Genera dominio Railway
railway domain

# O configura dominio custom
railway domain add yourdomain.com
```

### Post-Deploy Backend

#### 1. Verifica Deploy
```bash
# Controlla status
railway status

# Verifica logs
railway logs

# Test API
curl https://your-backend.railway.app/health
```

#### 2. Esegui Migrazioni
```bash
# Connetti a Railway e esegui migrazioni
railway run npm run migrate

# Seed dati se necessario
railway run npm run seed
```

#### 3. Test Admin Panel
```
https://your-backend.railway.app/app
```

## 🌐 3. Deploy Frontend (Vercel)

### Setup Automatico

```bash
# Usa lo script automatico
./scripts/deploy-frontend.sh
```

### Setup Manuale

#### 1. Login Vercel
```bash
vercel login
```

#### 2. Configura Progetto
```bash
cd frontend

# Deploy iniziale
vercel

# Configura per produzione
vercel --prod
```

#### 3. Configura Variabili
```bash
# Via CLI
vercel env add NEXT_PUBLIC_MEDUSA_BACKEND_URL production
# Inserisci: https://your-backend.railway.app

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# Inserisci: pk_live_your_stripe_key

vercel env add NEXT_PUBLIC_BASE_URL production
# Inserisci: https://your-domain.vercel.app
```

#### 4. Configura Dominio
```bash
# Aggiungi dominio custom
vercel domains add yourdomain.com

# Configura DNS
# A record: 76.76.19.61
# CNAME: cname.vercel-dns.com
```

### Post-Deploy Frontend

#### 1. Verifica Deploy
```bash
# Test sito
curl https://your-domain.vercel.app

# Verifica build
vercel logs
```

#### 2. Test Funzionalità
- ✅ Homepage carica
- ✅ Prodotti visibili
- ✅ Carrello funziona
- ✅ Checkout Stripe
- ✅ API backend raggiungibile

## 🔌 4. Deploy Integration Service

### Setup Denea Webhook

#### 1. Deploy su Railway
```bash
cd integrations

# Inizializza progetto separato
railway init cromos-integrations

# Configura variabili
railway variables set DENEA_API_URL="https://your-denea-api.com"
railway variables set DENEA_API_KEY="your_denea_key"
railway variables set DENEA_WEBHOOK_SECRET="your_webhook_secret"
railway variables set MEDUSA_BACKEND_URL="https://your-backend.railway.app"
railway variables set MEDUSA_API_KEY="your_medusa_admin_key"
railway variables set WEBHOOK_PORT="3001"
railway variables set NODE_ENV="production"

# Deploy
railway up
```

#### 2. Configura Cron Jobs
```bash
# Aggiungi al railway.json
{
  "cron": [
    {
      "name": "denea-sync",
      "schedule": "*/5 * * * *",
      "command": "npm run sync:api"
    }
  ]
}
```

#### 3. Test Webhook
```bash
# Test endpoint
curl -X POST https://your-integration.railway.app/webhook/denea \
  -H "Content-Type: application/json" \
  -H "X-Denea-Signature: test" \
  -d '{"test": "data"}'
```

## 🔐 5. Configurazione SSL/HTTPS

### Vercel (Automatico)
- ✅ SSL automatico per domini Vercel
- ✅ SSL automatico per domini custom
- ✅ HTTP/2 abilitato

### Railway (Automatico)
- ✅ SSL automatico per domini Railway
- ✅ SSL Let's Encrypt per domini custom

### Configurazione DNS

#### Per Vercel
```dns
# A Record
@ → 76.76.19.61

# CNAME
www → cname.vercel-dns.com
```

#### Per Railway
```dns
# CNAME per backend
api → your-backend.railway.app
```

## 📊 6. Monitoring e Logging

### Vercel Analytics

1. **Abilita Analytics**
   ```bash
   vercel analytics enable
   ```

2. **Real User Monitoring**
   - Dashboard Vercel > Analytics
   - Core Web Vitals
   - Page Views & Performance

### Railway Monitoring

1. **Metrics Dashboard**
   - CPU, Memory, Network usage
   - Response times
   - Error rates

2. **Log Aggregation**
   ```bash
   # Real-time logs
   railway logs --follow
   
   # Filtra per errori
   railway logs --filter error
   ```

### Database Monitoring (Neon)

1. **Performance Insights**
   - Query performance
   - Connection pooling stats
   - Storage usage

2. **Alerts**
   - CPU usage > 80%
   - Connection limit reached
   - Slow queries > 1s

## 🚨 7. Backup e Disaster Recovery

### Database Backup

#### Automatico (Neon)
```bash
# Neon fa backup automatici
# Retention: 7 giorni (free), 30 giorni (pro)
```

#### Manuale
```bash
# Backup completo
pg_dump "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/cromos_db?sslmode=require" > backup_$(date +%Y%m%d).sql

# Backup con compressione
pg_dump "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/cromos_db?sslmode=require" | gzip > backup_$(date +%Y%m%d).sql.gz

# Upload su S3/Google Cloud
aws s3 cp backup_$(date +%Y%m%d).sql.gz s3://your-backup-bucket/
```

### Code Backup

#### Git Repository
```bash
# Assicurati che tutto sia committato
git add .
git commit -m "Production deployment $(date)"
git push origin main

# Tag release
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

### Recovery Procedure

#### Database Recovery
```bash
# Restore da backup
psql "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/cromos_db?sslmode=require" < backup_20240115.sql
```

#### Application Recovery
```bash
# Rollback Vercel
vercel rollback

# Rollback Railway
railway rollback
```

## 🔄 8. CI/CD Setup

### GitHub Actions

#### Frontend CI/CD
```yaml
# .github/workflows/frontend.yml
name: Frontend Deploy

on:
  push:
    branches: [main]
    paths: ['frontend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Run tests
        run: |
          cd frontend
          npm run test
          npm run lint
          npm run type-check
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

#### Backend CI/CD
```yaml
# .github/workflows/backend.yml
name: Backend Deploy

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd backend
          npm ci
          
      - name: Build
        run: |
          cd backend
          npm run build
          
      - name: Deploy to Railway
        uses: railway-deploy/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

### Environment Secrets

#### GitHub Secrets
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
RAILWAY_TOKEN=your_railway_token
DATABASE_URL=your_production_db_url
STRIPE_API_KEY=your_stripe_key
SENDGRID_API_KEY=your_sendgrid_key
```

## 🧪 9. Testing in Production

### Smoke Tests

#### Frontend
```bash
# Test homepage
curl -I https://yourdomain.com
# Expected: 200 OK

# Test API connection
curl https://yourdomain.com/api/health
# Expected: {"status": "ok"}
```

#### Backend
```bash
# Test health endpoint
curl https://your-backend.railway.app/health
# Expected: {"status": "ok", "database": "connected"}

# Test admin panel
curl -I https://your-backend.railway.app/app
# Expected: 200 OK

# Test store API
curl https://your-backend.railway.app/store/products?limit=1
# Expected: JSON with products
```

### Load Testing

#### Artillery.js
```bash
npm install -g artillery

# Test frontend
artillery quick --count 10 --num 5 https://yourdomain.com

# Test backend API
artillery quick --count 10 --num 5 https://your-backend.railway.app/store/products
```

### End-to-End Testing

#### Playwright
```javascript
// tests/e2e/checkout.spec.js
test('complete checkout flow', async ({ page }) => {
  await page.goto('https://yourdomain.com')
  
  // Add product to cart
  await page.click('[data-testid="add-to-cart"]')
  
  // Go to checkout
  await page.click('[data-testid="checkout-button"]')
  
  // Fill shipping info
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="first_name"]', 'Test')
  await page.fill('[name="last_name"]', 'User')
  
  // Complete order
  await page.click('[data-testid="complete-order"]')
  
  // Verify success
  await expect(page.locator('[data-testid="order-success"]')).toBeVisible()
})
```

## 📈 10. Performance Optimization

### Frontend (Vercel)

#### Next.js Optimizations
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-backend.railway.app'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
```

#### CDN Configuration
- ✅ Vercel Edge Network automatico
- ✅ Image optimization automatica
- ✅ Static asset caching

### Backend (Railway)

#### Database Optimization
```sql
-- Indici per performance
CREATE INDEX CONCURRENTLY idx_product_status ON product(status) WHERE deleted_at IS NULL;
CREATE INDEX CONCURRENTLY idx_variant_inventory ON product_variant(inventory_quantity) WHERE deleted_at IS NULL;

-- Connection pooling
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
```

#### Redis Caching
```bash
# Aggiungi Redis su Railway
railway add redis

# Configura cache in Medusa
REDIS_URL=redis://default:password@redis-host:port
```

## 🔍 11. Troubleshooting Deploy

### Problemi Comuni

#### 1. Build Failures

**Frontend (Vercel)**
```bash
# Verifica build locale
cd frontend
npm run build

# Controlla logs Vercel
vercel logs --project cromos-frontend
```

**Backend (Railway)**
```bash
# Verifica build locale
cd backend
npm run build

# Controlla logs Railway
railway logs --service backend
```

#### 2. Database Connection Issues

```bash
# Test connessione
psql "postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/cromos_db?sslmode=require" -c "SELECT 1;"

# Verifica variabili Railway
railway variables

# Test da Railway
railway shell
npm run migrate:show
```

#### 3. CORS Errors

```bash
# Verifica CORS settings
railway variables get STORE_CORS
railway variables get ADMIN_CORS

# Update se necessario
railway variables set STORE_CORS="https://yourdomain.com,https://www.yourdomain.com"
```

#### 4. SSL Certificate Issues

```bash
# Verifica SSL Vercel
curl -I https://yourdomain.com
# Controlla certificate chain

# Verifica DNS
dig yourdomain.com
nslookup yourdomain.com
```

### Debug Commands

```bash
# Vercel debug
vercel inspect
vercel logs --follow

# Railway debug
railway status
railway logs --follow
railway shell

# Database debug
psql $DATABASE_URL -c "SELECT version();"
psql $DATABASE_URL -c "SELECT count(*) FROM product;"
```

## 📞 12. Support e Maintenance

### Monitoring Alerts

#### Setup Uptime Monitoring
```bash
# UptimeRobot, Pingdom, o simili
# Monitor endpoints:
# - https://yourdomain.com
# - https://your-backend.railway.app/health
# - Database connection
```

#### Log Aggregation
```bash
# Centralizza logs con:
# - Vercel Analytics
# - Railway Logs
# - Sentry per error tracking
```

### Maintenance Schedule

#### Weekly
- ✅ Controlla performance metrics
- ✅ Review error logs
- ✅ Backup database manuale
- ✅ Update dependencies (dev)

#### Monthly
- ✅ Security updates
- ✅ Performance optimization
- ✅ Cleanup old logs
- ✅ Review costs e usage

### Emergency Contacts

```yaml
# Team contacts
- Frontend Issues: frontend-team@company.com
- Backend Issues: backend-team@company.com
- Database Issues: dba@company.com
- Infrastructure: devops@company.com

# Service Status Pages
- Vercel: https://vercel-status.com
- Railway: https://status.railway.app
- Neon: https://status.neon.tech
```

---

## ✅ Deploy Checklist

### Pre-Deploy
- [ ] Tutti i test passano
- [ ] Build locale funziona
- [ ] Variabili d'ambiente configurate
- [ ] Database backup eseguito
- [ ] DNS configurato

### Deploy
- [ ] Backend deployato su Railway
- [ ] Database migrato
- [ ] Frontend deployato su Vercel
- [ ] Integration service attivo
- [ ] SSL certificati attivi

### Post-Deploy
- [ ] Smoke tests passano
- [ ] Monitoring attivo
- [ ] Logs verificati
- [ ] Performance accettabile
- [ ] Team notificato

### Rollback Plan
- [ ] Backup database disponibile
- [ ] Previous deployment tags
- [ ] Rollback procedure testata
- [ ] Emergency contacts aggiornati
