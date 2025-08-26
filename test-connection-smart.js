// Script inteligente para testar conexão com banco
const { Client } = require('pg');

console.log('🔍 TESTE INTELIGENTE DE CONEXÃO COM BANCO');
console.log('===========================================');
console.log('📡 Host: 108.181.224.233');
console.log('🔌 Porta: 5433');
console.log('===========================================');

// Função para testar uma combinação específica
async function testConnection(user, password, database, config = {}) {
  const client = new Client({
    host: '108.181.224.233',
    port: 5433,
    user: user,
    password: password,
    database: database,
    ...config
  });

  try {
    console.log(`🔍 Testando: ${user}@${database} com senha: ${password.substring(0, 8)}...`);
    await client.connect();
    console.log(`✅ SUCESSO! Conexão estabelecida!`);
    
    // Testar query para verificar se está funcionando
    const result = await client.query('SELECT current_database(), current_user, version()');
    console.log(`📊 Banco atual: ${result.rows[0].current_database}`);
    console.log(`👤 Usuário atual: ${result.rows[0].current_user}`);
    console.log(`🔧 Versão: ${result.rows[0].version.substring(0, 50)}...`);
    
    await client.end();
    return { success: true, user, password, database, config };
  } catch (err) {
    console.log(`❌ FALHOU: ${err.message}`);
    await client.end();
    return { success: false, error: err.message };
  }
}

// Função principal para testar
async function runTests() {
  console.log('\n🚀 INICIANDO TESTES...\n');
  
  // Teste 1: Configuração atual (que sabemos que não funciona)
  console.log('1️⃣ TESTE 1: Configuração atual');
  const result1 = await testConnection('postgres', 'AUD45hW9SUWEGXqr3CgwuNqkONpnAN3urtZpH0A6D4cym50AtNXm17PzBgNsnP0y', 'postgres');
  
  if (result1.success) {
    console.log('\n🎯 PROBLEMA RESOLVIDO! Use estas configurações:');
    console.log(`   Usuário: ${result1.user}`);
    console.log(`   Senha: ${result1.password}`);
    console.log(`   Banco: ${result1.database}`);
    return;
  }
  
  console.log('\n2️⃣ TESTE 2: Aguardando suas credenciais...');
  console.log('💡 Por favor, me forneça:');
  console.log('   - Usuário correto');
  console.log('   - Senha correta');
  console.log('   - Nome do banco correto');
  console.log('\n🔧 Ou você pode testar diretamente no servidor!');
}

runTests();
