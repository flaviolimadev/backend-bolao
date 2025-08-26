// Testar as credenciais atuais do .env
const { Client } = require('pg');

console.log('🔍 TESTANDO CREDENCIAIS ATUAIS DO .ENV');
console.log('========================================');

// Credenciais do .env atual
const config = {
  host: '108.181.224.233',
  port: 5433,
  user: 'postgres',
  password: 'AUD45hW9SUWEGXqr3CgwuNqkONpnAN3urtZpH0A6D4cym50AtNXm17PzBgNsnP0y',
  database: 'postgres'
};

console.log('📊 Configurações:');
console.log(`   Host: ${config.host}`);
console.log(`   Porta: ${config.port}`);
console.log(`   Usuário: ${config.user}`);
console.log(`   Senha: ${config.password.substring(0, 10)}...`);
console.log(`   Banco: ${config.database}`);

// Testar conexão
async function testConnection() {
  const client = new Client({
    ...config,
    ssl: false,
    connectionTimeoutMillis: 30000
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
