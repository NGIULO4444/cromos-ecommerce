# Dockerfile per Railway - Backend Medusa
FROM node:20-alpine

WORKDIR /app

# Non serve più postgresql-client con Medusa v2

# Copia i file del backend
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./

# Installa dipendenze con legacy peer deps per Medusa v2
RUN npm install --legacy-peer-deps

# Copia il resto del codice backend
COPY backend/ ./

# Skip custom build for Medusa v2 (no custom code yet)
# RUN npm run build

# Esponi la porta
EXPOSE 9000

# Variabili d'ambiente
ENV NODE_ENV=production
ENV PORT=9000
ENV HOST=0.0.0.0
ENV MEDUSA_ADMIN_PATH=/app
ENV MEDUSA_ADMIN_ONBOARDING_TYPE=default
ENV MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=./

# Avvio Medusa v2 con comandi corretti
CMD ["sh", "-c", "sleep 10 && npx medusa migrations run && npx medusa user -e admin@cromos.it -p admin123 && npx medusa develop"]
