#!/bin/bash

# Cromos Backend - Development Start Script
echo "🚀 Starting Cromos Backend in Development Mode..."

# Controlla se il file .env esiste
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from env.example..."
    cp env.example .env
    echo "✅ Please configure your .env file with the correct values"
    echo "📝 Edit .env file and run this script again"
    exit 1
fi

# Installa le dipendenze se node_modules non esiste
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Controlla se la connessione al database funziona
echo "🔍 Checking database connection..."
npm run migrate:show > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "⚠️  Database connection failed. Please check your DATABASE_URL in .env"
    echo "💡 Make sure your PostgreSQL database is running and accessible"
    exit 1
fi

# Esegui le migrazioni
echo "🔄 Running database migrations..."
npm run migrate

# Seed del database (opzionale)
read -p "🌱 Do you want to seed the database with sample data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npm run seed
fi

# Avvia il server in modalità development
echo "🎯 Starting Medusa development server..."
echo "📍 Admin Panel: http://localhost:9000/app"
echo "📍 API: http://localhost:9000"
echo "📍 Store API: http://localhost:9000/store"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
