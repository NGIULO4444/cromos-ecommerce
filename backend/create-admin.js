const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function createAdminUser() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('✅ Connesso al database');

    // Genera hash password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea utente admin
    const adminId = 'usr_admin_' + Date.now();
    
    await client.query(`
      INSERT INTO "user" (id, email, first_name, last_name, password_hash, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
    `, [
      adminId,
      'admin@cromos.com',
      'Admin',
      'Cromos',
      hashedPassword,
      'admin'
    ]);

    console.log('✅ Utente admin creato!');
    console.log('📧 Email: admin@cromos.com');
    console.log('🔑 Password: admin123');
    console.log('🌐 Admin Panel: http://localhost:9000/app');

  } catch (error) {
    console.error('❌ Errore:', error.message);
  } finally {
    await client.end();
  }
}

require('dotenv').config();
createAdminUser();
