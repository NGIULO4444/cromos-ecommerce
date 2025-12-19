#!/bin/sh
set -e

echo "🚀 Starting Spree Commerce..."

# Aspetta che il database sia pronto
echo "⏳ Waiting for database..."
until bundle exec rails runner "ActiveRecord::Base.connection.execute('SELECT 1')" > /dev/null 2>&1; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Esegui migrations
echo "📋 Running database migrations..."
bundle exec rails db:migrate 2>/dev/null || bundle exec rails db:create db:migrate

# Precompila assets se necessario
if [ ! -d "public/assets" ]; then
  echo "🎨 Precompiling assets..."
  bundle exec rails assets:precompile
fi

# Crea admin user se non esiste
echo "👤 Checking admin user..."
bundle exec rails runner "
  unless Spree::User.exists?(email: 'angelosann0@gmail.com')
    Spree::User.create!(
      email: 'angelosann0@gmail.com',
      password: 'callenger',
      password_confirmation: 'callenger'
    )
    puts '✅ Admin user created'
  else
    puts '✅ Admin user already exists'
  end
" 2>/dev/null || echo "⚠️  Could not create admin user (will be created on first access)"

echo "🎉 Spree is ready!"

# Esegui il comando passato (rails server)
exec "$@"
