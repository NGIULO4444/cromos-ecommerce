# Dockerfile ottimizzato per Railway
FROM node:18-alpine AS base

# Installa dipendenze di sistema
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copia package files
COPY package*.json ./
COPY tsconfig*.json ./

# Installa dipendenze
RUN npm ci --only=production && npm cache clean --force

# Copia il codice sorgente
COPY . .

# Build dell'applicazione
RUN npm run build

# Rimuovi devDependencies per ridurre la dimensione dell'immagine
RUN npm prune --production

# Esponi la porta
EXPOSE 9000

# Variabili d'ambiente per produzione
ENV NODE_ENV=production
ENV PORT=9000
ENV HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:9000/health || exit 1

# Avvia l'applicazione
CMD ["npm", "start"]
