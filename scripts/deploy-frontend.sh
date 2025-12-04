#!/bin/bash

# Cromos Frontend Deploy Script - Vercel
echo "🚀 Deploying Cromos Frontend to Vercel..."

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzione per logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Controlla se siamo nella directory corretta
if [ ! -f "frontend/package.json" ]; then
    error "Script deve essere eseguito dalla root del progetto Cromos"
    exit 1
fi

# Vai nella directory frontend
cd frontend

# Controlla se Vercel CLI è installato
if ! command -v vercel &> /dev/null; then
    warning "Vercel CLI non trovato. Installazione in corso..."
    npm install -g vercel
fi

# Controlla se .env.local esiste
if [ ! -f ".env.local" ]; then
    warning ".env.local non trovato. Copiando da env.local.example..."
    cp env.local.example .env.local
    warning "⚠️  Configura le variabili in .env.local prima del deploy!"
    read -p "Vuoi continuare? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Installa dipendenze
log "📦 Installando dipendenze..."
npm install

# Lint e type check
log "🔍 Eseguendo lint e type check..."
npm run lint
if [ $? -ne 0 ]; then
    error "Lint fallito. Correggi gli errori prima del deploy."
    exit 1
fi

npm run type-check
if [ $? -ne 0 ]; then
    error "Type check fallito. Correggi gli errori TypeScript prima del deploy."
    exit 1
fi

# Build locale per test
log "🔨 Eseguendo build di test..."
npm run build
if [ $? -ne 0 ]; then
    error "Build fallito. Correggi gli errori prima del deploy."
    exit 1
fi

success "Build di test completato con successo!"

# Chiedi conferma per il deploy
echo ""
log "Configurazione deploy:"
echo "  • Frontend: Next.js 14"
echo "  • Platform: Vercel"
echo "  • Environment: Production"
echo ""

read -p "Procedere con il deploy? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    warning "Deploy annullato dall'utente"
    exit 0
fi

# Deploy su Vercel
log "🚀 Deploying su Vercel..."

# Login se necessario
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    log "Login richiesto per Vercel..."
    vercel login
fi

# Deploy
vercel --prod

if [ $? -eq 0 ]; then
    success "🎉 Deploy completato con successo!"
    echo ""
    log "Il frontend è ora disponibile su Vercel"
    log "Controlla il dashboard Vercel per l'URL finale"
    echo ""
    log "📋 Post-deploy checklist:"
    echo "  ✅ Verifica che il sito sia accessibile"
    echo "  ✅ Testa le funzionalità principali"
    echo "  ✅ Controlla i log per eventuali errori"
    echo "  ✅ Configura il dominio custom se necessario"
else
    error "Deploy fallito. Controlla i log di Vercel per dettagli."
    exit 1
fi
