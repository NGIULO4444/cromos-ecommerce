#!/bin/bash

echo "🚂 DEPLOY MEDUSA BACKEND SU RAILWAY"
echo "===================================="

# Controlla se Railway CLI è installato
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI non trovato. Installazione..."
    npm install -g @railway/cli
fi

# Vai nella directory backend
cd "$(dirname "$0")/../backend"

echo "📦 Preparazione deploy..."

# Verifica che i file necessari esistano
if [ ! -f "package.json" ]; then
    echo "❌ package.json non trovato!"
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    echo "❌ Dockerfile non trovato!"
    exit 1
fi

echo "✅ File necessari trovati"

# Mostra le variabili d'ambiente necessarie
echo ""
echo "🔑 VARIABILI D'AMBIENTE NECESSARIE:"
echo "=================================="
echo "DATABASE_URL=postgresql://neondb_owner:npg_FyaYW0qd5HZg@ep-sweet-voice-aga83jqy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
echo "JWT_SECRET=20ad81325c2cfd9dde2e2bd75117535d8dd54f0e4e51d96de89264885fcd00ae5d9f760373de2931f0bcbda5ca3f72d761f523721bdc754df3ef4ebe6ca19618"
echo "COOKIE_SECRET=f92366ec0ab5db1dd2484bf50c66826406eed45d0c6550ddab97f8c12502969e0e2e946b8e4a6685ee5ba1cb2a6376b4ae442aa5175a5654d56c3c6ca635bad9"
echo "NODE_ENV=production"
echo "PORT=9000"
echo "HOST=0.0.0.0"
echo "STORE_CORS=https://frontend-aryze8c3s-angelosann0-gmailcoms-projects.vercel.app"
echo "ADMIN_CORS=https://frontend-aryze8c3s-angelosann0-gmailcoms-projects.vercel.app"
echo ""

echo "📋 ISTRUZIONI PER IL DEPLOY:"
echo "============================"
echo "1. Vai su https://railway.app"
echo "2. Fai login con il tuo account"
echo "3. Clicca 'New Project' → 'Deploy from GitHub repo'"
echo "4. Seleziona il repository cromos"
echo "5. Scegli la cartella 'backend'"
echo "6. Aggiungi le variabili d'ambiente sopra elencate"
echo "7. Clicca 'Deploy'"
echo ""
echo "🌐 Una volta deployato, il backend sarà disponibile su:"
echo "https://your-app-name.railway.app"
echo ""
echo "🔧 Admin Panel sarà disponibile su:"
echo "https://your-app-name.railway.app/app"

echo ""
echo "✅ Preparazione completata!"
echo "Segui le istruzioni sopra per completare il deploy su Railway."
