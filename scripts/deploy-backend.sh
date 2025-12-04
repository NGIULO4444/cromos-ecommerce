#!/bin/bash

# Cromos Backend Deploy Script - Railway
echo "🚀 Deploying Cromos Backend to Railway..."

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
if [ ! -f "backend/package.json" ]; then
    error "Script deve essere eseguito dalla root del progetto Cromos"
    exit 1
fi

# Vai nella directory backend
cd backend

# Controlla se Railway CLI è installato
if ! command -v railway &> /dev/null; then
    warning "Railway CLI non trovato. Installazione in corso..."
    npm install -g @railway/cli
fi

# Controlla se .env esiste
if [ ! -f ".env" ]; then
    warning ".env non trovato. Copiando da env.example..."
    cp env.example .env
    warning "⚠️  Configura le variabili in .env prima del deploy!"
    read -p "Vuoi continuare? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Installa dipendenze
log "📦 Installando dipendenze..."
npm install

# Build
log "🔨 Eseguendo build..."
npm run build
if [ $? -ne 0 ]; then
    error "Build fallito. Correggi gli errori prima del deploy."
    exit 1
fi

success "Build completato con successo!"

# Controlla connessione database
log "🔍 Verificando connessione database..."
if [ -n "$DATABASE_URL" ]; then
    # Test connessione (se hai psql installato)
    if command -v psql &> /dev/null; then
        psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            success "Connessione database OK"
        else
            warning "Impossibile verificare connessione database"
        fi
    else
        warning "psql non installato, impossibile verificare connessione database"
    fi
else
    warning "DATABASE_URL non configurato"
fi

# Chiedi conferma per il deploy
echo ""
log "Configurazione deploy:"
echo "  • Backend: Medusa.js"
echo "  • Platform: Railway"
echo "  • Environment: Production"
echo "  • Database: PostgreSQL (Neon)"
echo ""

read -p "Procedere con il deploy? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    warning "Deploy annullato dall'utente"
    exit 0
fi

# Login Railway se necessario
railway whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    log "Login richiesto per Railway..."
    railway login
fi

# Inizializza progetto Railway se necessario
if [ ! -f "railway.json" ]; then
    log "Inizializzando progetto Railway..."
    railway init
fi

# Configura variabili d'ambiente su Railway
log "🔧 Configurando variabili d'ambiente..."

# Leggi .env e carica su Railway
while IFS='=' read -r key value; do
    # Salta commenti e righe vuote
    if [[ $key =~ ^[[:space:]]*# ]] || [[ -z $key ]]; then
        continue
    fi
    
    # Rimuovi spazi e quotes
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs | sed 's/^"//;s/"$//')
    
    if [[ -n $key && -n $value ]]; then
        log "Setting $key..."
        railway variables set "$key=$value"
    fi
done < .env

# Deploy
log "🚀 Deploying su Railway..."
railway up

if [ $? -eq 0 ]; then
    success "🎉 Deploy completato con successo!"
    echo ""
    
    # Ottieni URL del servizio
    SERVICE_URL=$(railway status --json | jq -r '.deployments[0].url' 2>/dev/null)
    if [ "$SERVICE_URL" != "null" ] && [ -n "$SERVICE_URL" ]; then
        log "🌐 Backend URL: $SERVICE_URL"
        log "📊 Admin Panel: $SERVICE_URL/app"
        log "🔗 API: $SERVICE_URL/store"
    fi
    
    echo ""
    log "📋 Post-deploy checklist:"
    echo "  ✅ Verifica che l'API sia accessibile"
    echo "  ✅ Testa l'admin panel"
    echo "  ✅ Controlla i log per eventuali errori"
    echo "  ✅ Esegui le migrazioni database se necessario"
    echo "  ✅ Configura il dominio custom se necessario"
    echo ""
    log "🔧 Comandi utili:"
    echo "  • Logs: railway logs"
    echo "  • Status: railway status"
    echo "  • Variables: railway variables"
    echo "  • Shell: railway shell"
else
    error "Deploy fallito. Controlla i log di Railway per dettagli."
    echo ""
    log "🔧 Debug commands:"
    echo "  • railway logs"
    echo "  • railway status"
    exit 1
fi
