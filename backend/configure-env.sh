#!/bin/bash

# Script per configurare il file .env del backend

echo "🔧 Configurando file .env per test locale..."

cat > .env << 'EOF'
# Database Neon
DATABASE_URL=postgresql://neondb_owner:npg_FyaYW0qd5HZg@ep-sweet-voice-aga83jqy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Redis (per ora commentiamo)
# REDIS_URL=redis://localhost:6379

# JWT & Cookie Secrets (valori temporanei per test)
JWT_SECRET=cromos-test-jwt-secret-key-2024
COOKIE_SECRET=cromos-test-cookie-secret-key-2024

# CORS Settings per sviluppo locale
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:7000,http://localhost:7001

# Stripe (per ora commentiamo - aggiungeremo dopo)
# STRIPE_API_KEY=sk_test_your_stripe_secret_key
# STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (per ora commentiamo - aggiungeremo dopo)
# SENDGRID_API_KEY=your_sendgrid_api_key
# SENDGRID_FROM=noreply@cromos.com

# Admin Panel
OPEN_BROWSER=false

# Node Environment
NODE_ENV=development

# Railway/Production Settings
PORT=9000
HOST=0.0.0.0
EOF

echo "✅ File .env configurato per test locale!"
