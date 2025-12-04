# Cromos E-commerce - Setup Guide

Guida completa per configurare e avviare il progetto Cromos da zero.

## 📋 Prerequisiti

### Software Richiesto
- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** o **yarn** - Incluso con Node.js
- **Git** - [Download](https://git-scm.com/)
- **PostgreSQL** (locale) o account **Neon** - [Neon.tech](https://neon.tech/)

### Account Servizi
- **Stripe** (modalità test) - [Dashboard](https://dashboard.stripe.com/)
- **Brevo** (ex-SendinBlue) - [Signup](https://www.brevo.com/)
- **Vercel** - [Signup](https://vercel.com/)
- **Railway** - [Signup](https://railway.app/)
- **Neon** - [Signup](https://neon.tech/)

## 🚀 Quick Start

### 1. Clone e Setup Automatico

```bash
# Clone del repository
git clone <your-repo-url>
cd cromos

# Setup automatico
./scripts/setup-project.sh
```

Lo script automatico:
- ✅ Verifica prerequisiti
- ✅ Installa tutte le dipendenze
- ✅ Crea file .env da template
- ✅ Inizializza Git repository
- ✅ Crea .gitignore

### 2. Configurazione Database

#### Opzione A: Neon (Consigliato per produzione)

1. Crea account su [Neon.tech](https://neon.tech/)
2. Crea nuovo database PostgreSQL
3. Copia la connection string
4. Aggiorna `backend/.env`:

```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/cromos_db?sslmode=require
```

#### Opzione B: PostgreSQL Locale

```bash
# Installa PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Crea database
createdb cromos_db

# Aggiorna backend/.env
DATABASE_URL=postgresql://localhost:5432/cromos_db
```

### 3. Configurazione Servizi

#### Stripe

1. Vai su [Stripe Dashboard](https://dashboard.stripe.com/)
2. Ottieni le chiavi di test
3. Configura in `backend/.env` e `frontend/.env.local`:

```env
# Backend
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### Brevo Email

1. Crea account [Brevo](https://www.brevo.com/)
2. Ottieni API key da Settings > SMTP & API
3. Configura in `backend/.env`:

```env
SENDGRID_API_KEY=your_brevo_api_key
SENDGRID_FROM=noreply@yourdomain.com
```

### 4. Avvio Sviluppo

#### Terminal 1: Backend
```bash
cd backend
npm run dev
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

#### Terminal 3: Webhook Server (opzionale)
```bash
cd integrations
npm run webhook:start
```

### 5. Accesso Applicazione

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:9000
- **Admin Panel**: http://localhost:9000/app
- **Webhook Server**: http://localhost:3001

## 🔧 Configurazione Dettagliata

### Backend Environment (.env)

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/cromos_db

# Redis (Upstash per Railway)
REDIS_URL=redis://localhost:6379

# JWT & Cookie Secrets
JWT_SECRET=your-super-secret-jwt-key-here
COOKIE_SECRET=your-super-secret-cookie-key-here

# CORS Settings
STORE_CORS=http://localhost:3000,https://your-frontend-domain.vercel.app
ADMIN_CORS=http://localhost:7000,http://localhost:7001

# Stripe Payment
STRIPE_API_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (Brevo/SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM=noreply@cromos.com

# Email Templates IDs
SENDGRID_ORDER_PLACED_ID=d-xxx
SENDGRID_ORDER_SHIPPED_ID=d-xxx
SENDGRID_USER_PASSWORD_RESET_ID=d-xxx

# Admin Panel
OPEN_BROWSER=false

# Node Environment
NODE_ENV=development

# Denea Integration
DENEA_API_URL=https://your-denea-api-endpoint.com
DENEA_API_KEY=your_denea_api_key
DENEA_WEBHOOK_SECRET=your_denea_webhook_secret

# Railway/Production Settings
PORT=9000
HOST=0.0.0.0
```

### Frontend Environment (.env.local)

```env
# Medusa Backend
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Base URL del sito
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Analytics (opzionale)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=true

# Environment
NODE_ENV=development
```

## 🗄️ Database Setup

### 1. Migrazioni

```bash
cd backend

# Esegui migrazioni Medusa
npm run migrate

# Esegui migrazioni custom
psql $DATABASE_URL -f ../database/migrations/001_initial_setup.sql
```

### 2. Seed Data (Opzionale)

```bash
# Seed dati di esempio
npm run seed
```

### 3. Verifica Setup

```bash
# Controlla tabelle create
psql $DATABASE_URL -c "\dt"

# Verifica dati
psql $DATABASE_URL -c "SELECT * FROM region;"
```

## 🔌 Integrazione Denea

### 1. Configurazione

Aggiorna le variabili Denea in `backend/.env`:

```env
DENEA_API_URL=https://your-denea-endpoint.com
DENEA_API_KEY=your_api_key
DENEA_WEBHOOK_SECRET=your_webhook_secret
```

### 2. Test Sincronizzazione

```bash
cd integrations

# Test con file CSV
npm run sync:csv path/to/products.csv

# Test con file XML
npm run sync:xml path/to/products.xml

# Test API sync
npm run sync:api
```

### 3. Webhook Setup

```bash
# Avvia webhook server
npm run webhook:start

# Test webhook
curl -X POST http://localhost:3001/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 🚀 Deploy in Produzione

### 1. Frontend su Vercel

```bash
# Deploy automatico
./scripts/deploy-frontend.sh

# O manualmente
cd frontend
vercel --prod
```

### 2. Backend su Railway

```bash
# Deploy automatico
./scripts/deploy-backend.sh

# O manualmente
cd backend
railway login
railway init
railway up
```

### 3. Database Neon

1. Crea database produzione su Neon
2. Aggiorna `DATABASE_URL` su Railway
3. Esegui migrazioni:

```bash
railway run npm run migrate
```

### 4. Configurazione Domini

#### Frontend (Vercel)
1. Vai su Vercel Dashboard
2. Settings > Domains
3. Aggiungi dominio custom

#### Backend (Railway)
1. Vai su Railway Dashboard
2. Settings > Domains
3. Genera dominio Railway o configura custom

## 🔍 Troubleshooting

### Problemi Comuni

#### 1. Errore Connessione Database
```bash
# Verifica connessione
psql $DATABASE_URL -c "SELECT 1;"

# Controlla formato URL
echo $DATABASE_URL
```

#### 2. Errore CORS
Aggiorna CORS settings in `backend/.env`:
```env
STORE_CORS=http://localhost:3000,https://your-domain.com
ADMIN_CORS=http://localhost:7000,https://your-admin-domain.com
```

#### 3. Errore Stripe
```bash
# Verifica chiavi Stripe
stripe listen --forward-to localhost:9000/hooks/stripe
```

#### 4. Errore Build Frontend
```bash
cd frontend
npm run lint:fix
npm run type-check
npm run build
```

### Log e Debug

#### Backend Logs
```bash
cd backend
npm run dev # Logs in console

# Railway logs
railway logs
```

#### Frontend Logs
```bash
cd frontend
npm run dev # Logs in console

# Vercel logs
vercel logs
```

#### Database Logs
```bash
# Neon dashboard > Monitoring
# O query dirette:
psql $DATABASE_URL -c "SELECT * FROM inventory_sync_log ORDER BY created_at DESC LIMIT 10;"
```

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:9000/health

# Frontend health
curl http://localhost:3000/api/health

# Webhook server health
curl http://localhost:3001/health
```

### Performance

```bash
# Database performance
psql $DATABASE_URL -c "SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Application metrics
# Vercel Analytics (frontend)
# Railway Metrics (backend)
```

## 🔐 Sicurezza

### Variabili Sensibili

❌ **Mai committare**:
- File `.env*`
- Chiavi API
- Password database
- Secrets JWT/Cookie

✅ **Usa sempre**:
- File `.env.example` per template
- Variabili d'ambiente su piattaforme deploy
- Secrets manager per produzione

### HTTPS

- **Vercel**: HTTPS automatico
- **Railway**: HTTPS automatico
- **Custom Domain**: Configura SSL certificate

## 📞 Supporto

### Documentazione
- [API Reference](./API.md)
- [Deploy Guide](./DEPLOY.md)
- [Denea Integration](./DENEA.md)

### Community
- GitHub Issues per bug report
- Discussions per domande
- Discord per supporto real-time

### Logs Utili

```bash
# Tutti i servizi
docker-compose logs -f

# Solo backend
railway logs --service backend

# Solo frontend
vercel logs --project cromos-frontend
```
