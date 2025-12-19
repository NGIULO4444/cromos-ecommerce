# Dockerfile per Railway - Backend Medusa
FROM node:18-alpine

WORKDIR /app

# Non serve più postgresql-client con Medusa v2

# Copia i file del backend
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./

# Installa dipendenze con legacy peer deps per Medusa v2
RUN npm install --legacy-peer-deps

# Copia il resto del codice backend
COPY backend/ ./

# Build dell'applicazione
RUN npm run build

# Esponi la porta
EXPOSE 9000

# Variabili d'ambiente
ENV NODE_ENV=production
ENV PORT=9000
ENV HOST=0.0.0.0
ENV MEDUSA_ADMIN_PATH=/app
ENV MEDUSA_ADMIN_ONBOARDING_TYPE=default
ENV MEDUSA_ADMIN_ONBOARDING_NEXTJS_DIRECTORY=./

# Avvio Medusa v2 con seed
CMD ["sh", "-c", "sleep 10 && npx medusa db:migrate && npx medusa user create --email admin@cromos.it --password admin123 && npm start"]
