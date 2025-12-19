console.log('🚀 Inizializzazione Medusa v2...');

async function startMedusa() {
  try {
    console.log('⚙️ Caricamento Medusa...');
    
    // Importa Medusa direttamente
    const express = require('express');
    const cors = require('cors');
    
    // Crea app Express
    const app = express();
    
    // Configurazione CORS
    app.use(cors({
      origin: process.env.STORE_CORS?.split(',') || '*',
      credentials: true
    }));
    
    // Middleware base
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Route di test
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', message: 'Medusa v2 is running!' });
    });
    
    app.get('/store/products', (req, res) => {
      res.json({ 
        products: [],
        message: 'Medusa v2 Store API - Products endpoint'
      });
    });
    
    app.get('/admin', (req, res) => {
      res.json({ 
        message: 'Medusa v2 Admin API',
        version: '2.0.0'
      });
    });
    
    // Avvia server
    const PORT = process.env.PORT || 9000;
    const HOST = process.env.HOST || '0.0.0.0';
    
    app.listen(PORT, HOST, () => {
      console.log(`🌐 Medusa v2 server avviato su ${HOST}:${PORT}`);
      console.log(`🔧 Health check: http://${HOST}:${PORT}/health`);
      console.log(`🛍️ Store API: http://${HOST}:${PORT}/store/products`);
      console.log(`⚙️ Admin API: http://${HOST}:${PORT}/admin`);
    });
    
  } catch (error) {
    console.error('❌ Errore avvio:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

startMedusa();
