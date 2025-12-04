# Cromos E-commerce - Headless Architecture

🚀 **E-commerce completo open-source con architettura headless**

## 🏗️ Architettura

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Medusa.js + PostgreSQL
- **Database**: Neon PostgreSQL
- **Payments**: Stripe
- **Email**: Brevo SMTP
- **Deploy**: Vercel (Frontend) + Railway (Backend)
- **Gestionale**: Integrazione Denea Easy FTT

## 📁 Struttura Progetto

```
cromos/
├── frontend/          # Next.js 14 App Router
├── backend/           # Medusa.js Backend
├── database/          # Schema e migrazioni
├── integrations/      # Denea sync & webhooks
├── docs/             # Documentazione completa
├── scripts/          # Script di deploy e utility
└── docker/           # Configurazioni Docker
```

## 🚀 Quick Start

1. **Clone del repository**
```bash
git clone <repo-url>
cd cromos
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configura le variabili in .env
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Configura le variabili in .env.local
npm run dev
```

4. **Accesso**
- Frontend: http://localhost:3000
- Backend Admin: http://localhost:9000/app
- API: http://localhost:9000

## 📚 Documentazione

- [Setup Completo](./docs/SETUP.md)
- [API Reference](./docs/API.md)
- [Deploy Guide](./docs/DEPLOY.md)
- [Integrazione Denea](./docs/DENEA.md)

## 🛠️ Tecnologie

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- React Hook Form
- Framer Motion

### Backend
- Medusa.js v2
- PostgreSQL (Neon)
- Redis (Upstash)
- Stripe
- Brevo SMTP

### DevOps
- Docker
- Vercel (Frontend)
- Railway (Backend)
- GitHub Actions

## 🔧 Features

### E-commerce Core
- ✅ Catalogo prodotti dinamico
- ✅ Carrello persistente
- ✅ Checkout con Stripe
- ✅ Gestione ordini
- ✅ Account utente
- ✅ Admin panel

### Gestione Magazzino
- ✅ Sincronizzazione Denea Easy FTT
- ✅ Aggiornamento stock real-time
- ✅ Webhook inventory
- ✅ Scheduler automatico

### SEO & Performance
- ✅ SSR/SSG ottimizzato
- ✅ Sitemap dinamica
- ✅ Meta tags SEO
- ✅ Core Web Vitals
- ✅ PWA ready

## 📄 Licenza

MIT License - Completamente open-source e gratuito

## 🤝 Contributi

I contributi sono benvenuti! Leggi [CONTRIBUTING.md](./CONTRIBUTING.md) per iniziare.

## 📞 Supporto

Per supporto e domande:
- 📧 Email: support@cromos.com
- 💬 Discord: [Cromos Community](https://discord.gg/cromos)
- 📖 Docs: [docs.cromos.com](https://docs.cromos.com)
