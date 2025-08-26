// Script para testar diferentes senhas e configurações
const { Client } = require('pg');

// Senhas para testar
const passwords = [
  'AUD45hW9SUWEGXqr3CgwuNqkONpnAN3urtZpH0A6D4cym50AtNXm17PzBgNsnP0y',
  'AUD45hW9SUWEGXqr3CgwuNqkONpnAN3urtZpH0A6D4cym50AtNXm17PzBgNsnP0y',
  'postgres',
  'admin',
  'password',
  '123456'
];

// Configurações para testar
const configs = [
  { ssl: false },
  { ssl: { rejectUnauthorized: false } },
  { ssl: 'require' }
];

async function testConnection(password, config = {}) {
  const client = new Client({
    host: '108.181.224.233',
    port: 5433,
    user: 'postgres',
    password: password,
    database: 'postgres',
    ...config
  });

  try {
    console.log(`🔍 Testando senha: ${password.substring(0, 10)}... com config:`, config);
    await client.connect();
    console.log(`✅ SUCESSO! Senha: ${password.substring(0, 10)}...`);
    
    // Testar query simples
    const result = await client.query('SELECT version()');
    console.log(`📊 Versão do banco: ${result.rows[0].version.substring(0, 50)}...`);
    
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ FALHOU: ${err.message}`);
    await client.end();
    return false;
  }
}

async function testAll() {
  console.log('🔍 TESTANDO DIFERENTES SENHAS E CONFIGURAÇÕES');
  console.log('================================================');
  
  for (const password of passwords) {
    for (const config of configs) {
      const success = await testConnection(password, config);
      if (success) {
        console.log(`\n🎯 SENHA ENCONTRADA: ${password}`);
        console.log(`🎯 CONFIGURAÇÃO:`, config);
        return;
      }
      console.log('---');
    }
  }
  
  console.log('\n❌ Nenhuma combinação funcionou!');
}

testAll();
