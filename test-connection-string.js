// Testar a string de conexão do final do .env
const { Client } = require('pg');

console.log('🔍 TESTANDO STRING DE CONEXÃO DO .ENV');
console.log('======================================');

// String de conexão encontrada no .env
const connectionString = 'postgres://postgres:3ecec961f8cd455298a9@db_clientes_sistemabolao:5432/sistemabolao?sslmode=disable';

console.log('📡 String de conexão:', connectionString);
console.log('🔍 Extraindo informações...');

// Extrair informações da string
const url = new URL(connectionString);
const host = url.hostname;
const port = url.port;
const user = url.username;
const password = url.password;
const database = url.pathname.substring(1);

console.log('📊 Informações extraídas:');
console.log(`   Host: ${host}`);
console.log(`   Porta: ${port}`);
console.log(`   Usuário: ${user}`);
console.log(`   Senha: ${password}`);
console.log(`   Banco: ${database}`);

// Testar conexão
async function testConnection() {
  const client = new Client({
    host: host,
    port: parseInt(port),
    user: user,
    password: password,
    database: database,
    ssl: false
  });

  try {
    console.log('\n🚀 Testando conexão...');
    await client.connect();
    console.log('✅ SUCESSO! Conexão estabelecida!');
    
    // Testar query
    const result = await client.query('SELECT current_database(), current_user, version()');
    console.log(`📊 Banco atual: ${result.rows[0].current_database}`);
    console.log(`👤 Usuário atual: ${result.rows[0].current_user}`);
    console.log(`🔧 Versão: ${result.rows[0].version.substring(0, 50)}...`);
    
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ FALHOU: ${err.message}`);
    await client.end();
    return false;
  }
}

testConnection();
