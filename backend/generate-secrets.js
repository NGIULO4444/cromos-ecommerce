#!/usr/bin/env node

const crypto = require('crypto');

// Genera segreti sicuri
const jwtSecret = crypto.randomBytes(64).toString('hex');
const cookieSecret = crypto.randomBytes(64).toString('hex');

console.log('🔐 SEGRETI GENERATI PER RAILWAY:');
console.log('================================');
console.log('');
console.log('JWT_SECRET=' + jwtSecret);
console.log('COOKIE_SECRET=' + cookieSecret);
console.log('');
console.log('📋 Copia questi valori nelle variabili d\'ambiente di Railway');
console.log('⚠️  IMPORTANTE: Conserva questi segreti in modo sicuro!');
