// Testar carregamento das variáveis de ambiente
require('dotenv').config();

console.log('🔍 TESTANDO CARREGAMENTO DAS VARIÁVEIS DE AMBIENTE');
console.log('==================================================');

const vars = [
  'NODE_ENV',
  'PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE'
];

console.log('📊 Variáveis carregadas:');
vars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName === 'DB_PASSWORD') {
      console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: NÃO DEFINIDA`);
  }
});

console.log('\n🔧 Configuração final:');
console.log(`Host: ${process.env.DB_HOST}`);
console.log(`Porta: ${process.env.DB_PORT}`);
console.log(`Usuário: ${process.env.DB_USERNAME}`);
console.log(`Banco: ${process.env.DB_DATABASE}`);

// Testar se funciona
const { Client } = require('pg');

async function testWithEnvVars() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: false
  });

  try {
    console.log('\n🚀 Testando conexão com variáveis do .env...');
    await client.connect();
    console.log('✅ SUCESSO! Conexão estabelecida!');
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ FALHOU: ${err.message}`);
    await client.end();
    return false;
  }
}

testWithEnvVars();
