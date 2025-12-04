const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupCustomTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Connesso al database Neon');

    // Leggi il file di migrazione custom
    const migrationPath = path.join(__dirname, '..', 'database', 'migrations', '001_initial_setup.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('🔄 Eseguendo migrazioni custom...');
    await client.query(migrationSQL);
    console.log('✅ Migrazioni custom completate!');

    // Verifica che le tabelle siano state create
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('phone_accessorie_category', 'product_extended', 'denea_sync_mapping', 'inventory_sync_log')
      ORDER BY table_name;
    `);

    console.log('📋 Tabelle custom create:');
    result.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });

  } catch (error) {
    console.error('❌ Errore durante setup tabelle custom:', error.message);
  } finally {
    await client.end();
  }
}

// Carica variabili d'ambiente
require('dotenv').config();

// Esegui setup
setupCustomTables();
