# Dockerfile ottimizzato per Coolify
FROM node:18-alpine

WORKDIR /app

# Installa curl per health check
RUN apk add --no-cache curl

# Copia package files
COPY package*.json ./
COPY tsconfig*.json ./

# Installa dipendenze
RUN npm ci --only=production && npm cache clean --force

# Copia il codice sorgente
COPY . .

# Build dell'applicazione
RUN npm run build

# Esponi la porta
EXPOSE 9000

# Variabili d'ambiente
ENV NODE_ENV=production
ENV PORT=9000
ENV HOST=0.0.0.0

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:9000/health || exit 1

# Avvia l'applicazione
CMD ["npm", "start"]