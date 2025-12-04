# Dockerfile semplificato per Railway
FROM node:18-alpine

WORKDIR /app

# Copia tutti i file
COPY . .

# Installa dipendenze
RUN npm install

# Build dell'applicazione
RUN npm run build

# Esponi la porta
EXPOSE 9000

# Variabili d'ambiente
ENV NODE_ENV=production
ENV PORT=9000
ENV HOST=0.0.0.0

# Avvia l'applicazione
CMD ["npm", "start"]
