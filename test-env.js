// Script para testar se as variáveis de ambiente estão sendo lidas
require('dotenv/config');

console.log('🔍 TESTANDO VARIÁVEIS DE AMBIENTE');
console.log('=====================================');

// Testar variáveis principais
const vars = [
  'NODE_ENV',
  'PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
  'JWT_SECRET',
  'FRONTEND_URL',
  'RESEND_API_KEY'
];

vars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`);
  } else {
    console.log(`❌ ${varName}: NÃO DEFINIDA`);
  }
});

console.log('=====================================');
console.log('🔧 DB_HOST atual:', process.env.DB_HOST);
console.log('🔧 DB_PORT atual:', process.env.DB_PORT);
console.log('🔧 Tentando conectar em:', `${process.env.DB_HOST}:${process.env.DB_PORT}`);

// Testar conexão com banco
const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    await client.connect();
    console.log('✅ Conexão com banco: SUCESSO');
    await client.end();
  } catch (err) {
    console.log('❌ Conexão com banco: FALHOU');
    console.log('   Erro:', err.message);
  }
}

testConnection();
