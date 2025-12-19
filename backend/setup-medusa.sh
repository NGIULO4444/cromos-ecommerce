#!/bin/bash

echo "🚀 Setup Medusa v2 Database..."

# 1. Esegui migrazioni
echo "📋 Eseguendo migrazioni database..."
npx medusa migrations run

# 2. Seed database con dati iniziali
echo "🌱 Popolando database con dati iniziali..."
npx medusa seed -f ./data/seed-complete.json

# 3. Crea utente admin (se il seed non funziona)
echo "👤 Creando utente admin..."
npx medusa user -e admin@cromos.it -p admin123

echo "✅ Setup completato!"
echo "🌐 Avvia il server con: npx medusa develop"
echo "🔧 Admin panel: http://localhost:9000/app"
