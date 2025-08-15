-- Arquivo de inicialização do banco de dados
-- Este arquivo é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criar banco de dados se não existir
-- (O PostgreSQL já cria o banco via variável de ambiente)

-- Comentário: As tabelas serão criadas automaticamente pelo TypeORM
-- quando a aplicação NestJS iniciar pela primeira vez

-- Configurações de performance
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET pg_stat_statements.track = 'all';
ALTER SYSTEM SET pg_stat_statements.max = 10000;

-- Recarregar configurações
SELECT pg_reload_conf();

-- Log de inicialização
DO $$
BEGIN
    RAISE NOTICE 'Banco de dados inicializado com sucesso!';
    RAISE NOTICE 'Extensões UUID e PGCrypto habilitadas';
    RAISE NOTICE 'Configurações de performance aplicadas';
END $$;

