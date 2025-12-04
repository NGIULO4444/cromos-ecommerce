#!/bin/bash

# Cromos Project Setup Script
echo "🚀 Setting up Cromos E-commerce Project..."

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

# Banner
echo "
╔══════════════════════════════════════════════════════════════╗
║                    CROMOS E-COMMERCE                         ║
║                  Project Setup Script                       ║
║                                                              ║
║  🏗️  Headless Architecture                                   ║
║  ⚡ Next.js 14 + Medusa.js                                   ║
║  🎨 Tailwind CSS                                             ║
║  🗄️  PostgreSQL + Neon                                       ║
║  🚀 Vercel + Railway Deploy                                  ║
╚══════════════════════════════════════════════════════════════╝
"

# Controlla prerequisiti
log "🔍 Checking prerequisites..."

# Node.js
if ! command -v node &> /dev/null; then
    error "Node.js is required. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

success "Node.js $(node -v) ✓"

# npm
if ! command -v npm &> /dev/null; then
    error "npm is required"
    exit 1
fi

success "npm $(npm -v) ✓"

# Git
if ! command -v git &> /dev/null; then
    warning "Git not found. Install Git for version control."
else
    success "Git $(git --version | cut -d' ' -f3) ✓"
fi

echo ""

# Setup Backend
log "📦 Setting up Backend (Medusa.js)..."
cd backend

if [ ! -f ".env" ]; then
    log "Creating .env file from template..."
    cp env.example .env
    warning "⚠️  Please configure your .env file with actual values"
fi

log "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    success "Backend dependencies installed ✓"
else
    error "Failed to install backend dependencies"
    exit 1
fi

cd ..

# Setup Frontend
log "📦 Setting up Frontend (Next.js)..."
cd frontend

if [ ! -f ".env.local" ]; then
    log "Creating .env.local file from template..."
    cp env.local.example .env.local
    warning "⚠️  Please configure your .env.local file with actual values"
fi

log "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    success "Frontend dependencies installed ✓"
else
    error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Setup Integrations
log "📦 Setting up Denea Integration..."
cd integrations

log "Installing integration dependencies..."
npm install

if [ $? -eq 0 ]; then
    success "Integration dependencies installed ✓"
else
    error "Failed to install integration dependencies"
    exit 1
fi

cd ..

# Git initialization
if [ -d ".git" ]; then
    log "Git repository already initialized"
else
    log "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial Cromos e-commerce setup"
    success "Git repository initialized ✓"
fi

# Create .gitignore if not exists
if [ ! -f ".gitignore" ]; then
    log "Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/

# Environment files
.env
.env.local
.env.production
.env.staging
.env.test

# Build outputs
dist/
build/
.next/
*/dist/
*/build/
*/.next/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Dependency directories
.npm
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.pnp.*

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/
*/tmp/
*/temp/

# Editor directories and files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Database
*.sqlite
*.sqlite3
*.db

# Uploads
uploads/
*/uploads/

# Railway
.railway/

# Vercel
.vercel/
EOF
    success ".gitignore created ✓"
fi

echo ""
success "🎉 Cromos project setup completed!"

echo ""
log "📋 Next Steps:"
echo ""
echo "1. 🗄️  Database Setup:"
echo "   • Create a Neon PostgreSQL database"
echo "   • Update DATABASE_URL in backend/.env"
echo "   • Run: cd backend && npm run migrate"
echo ""
echo "2. 🔧 Configuration:"
echo "   • Configure Stripe keys in both .env files"
echo "   • Set up Brevo/SendGrid for emails"
echo "   • Configure Denea API credentials"
echo ""
echo "3. 🚀 Development:"
echo "   • Backend: cd backend && npm run dev"
echo "   • Frontend: cd frontend && npm run dev"
echo "   • Integration: cd integrations && npm run webhook:start"
echo ""
echo "4. 📚 Documentation:"
echo "   • Read docs/SETUP.md for detailed instructions"
echo "   • Check docs/API.md for API reference"
echo ""
echo "5. 🌐 Deploy:"
echo "   • Frontend: ./scripts/deploy-frontend.sh"
echo "   • Backend: ./scripts/deploy-backend.sh"
echo ""

log "🔗 Useful URLs (after starting dev servers):"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend API: http://localhost:9000"
echo "   • Admin Panel: http://localhost:9000/app"
echo "   • Webhook Server: http://localhost:3001"
echo ""

warning "⚠️  Remember to configure all environment variables before starting!"

echo ""
log "Happy coding! 🎯"
