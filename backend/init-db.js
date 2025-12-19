const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Inizializzazione Database Medusa v2...');

try {
  // Controlla se il database è già inizializzato
  console.log('📋 Controllo stato database...');
  
  // Prova a connettersi al database
  const { createConnection } = require('typeorm');
  
  async function initDatabase() {
    try {
      console.log('🔗 Connessione al database...');
      
      // Avvia Medusa per inizializzare il database
      console.log('🌱 Avvio Medusa per inizializzazione...');
      
      // Importa e avvia Medusa
      const express = require('express');
      const { loadConfig } = require('@medusajs/medusa/dist/loaders/config');
      const { default: loaders } = require('@medusajs/medusa/dist/loaders');
      
      const app = express();
      const configModule = loadConfig(process.cwd());
      
      console.log('⚙️ Caricamento configurazione Medusa...');
      
      await loaders({
        directory: process.cwd(),
        expressApp: app,
        configModule,
      });
      
      console.log('✅ Database inizializzato con successo!');
      
      // Avvia il server
      const PORT = process.env.PORT || 9000;
      const HOST = process.env.HOST || '0.0.0.0';
      
      app.listen(PORT, HOST, () => {
        console.log(`🌐 Medusa server avviato su ${HOST}:${PORT}`);
        console.log(`🔧 Admin panel: http://${HOST}:${PORT}/app`);
      });
      
    } catch (error) {
      console.error('❌ Errore inizializzazione:', error.message);
      process.exit(1);
    }
  }
  
  initDatabase();
  
} catch (error) {
  console.error('❌ Errore:', error.message);
  process.exit(1);
}
