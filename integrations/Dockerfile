# Dockerfile per Denea Integration Service
FROM node:18-alpine

WORKDIR /app

# Installa dipendenze di sistema
RUN apk add --no-cache curl

# Copia package files
COPY package*.json ./
COPY tsconfig.json ./

# Installa dipendenze
RUN npm ci --only=production

# Copia codice sorgente
COPY . .

# Build TypeScript
RUN npm run build

# Crea directory temp per file upload
RUN mkdir -p temp

# Esponi porta webhook
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Comando di default (webhook server)
CMD ["npm", "start"]
