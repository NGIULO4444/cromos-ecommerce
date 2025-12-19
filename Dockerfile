# Dockerfile per Railway - Backend Medusa
FROM node:18-alpine

WORKDIR /app

# Copia i file del backend
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./

# Installa dipendenze
RUN npm install

# Copia il resto del codice backend
COPY backend/ ./

# Build dell'applicazione (solo server)
RUN npm run clean && npm run build:server

# Esponi la porta
EXPOSE 9000

# Variabili d'ambiente
ENV NODE_ENV=production
ENV PORT=9000
ENV HOST=0.0.0.0
ENV MEDUSA_ADMIN_PATH=/app
ENV MEDUSA_ADMIN_ONBOARDING_TYPE=default
ENV MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=./

# Avvia l'applicazione
CMD ["npm", "start"]
