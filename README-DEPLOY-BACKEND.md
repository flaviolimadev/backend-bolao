# 🚀 Deploy do Backend NestJS na Coolify

Este documento contém todas as instruções necessárias para fazer o deploy do backend NestJS na Coolify.

## 📋 Pré-requisitos

- Coolify configurado e funcionando
- Acesso ao repositório Git
- Docker instalado (para testes locais)
- Banco de dados PostgreSQL configurado

## 🐳 Arquivos Docker Criados

### 1. **Dockerfile** (Produção)
- Multi-stage build otimizado
- Node.js 18 Alpine para build e produção
- Usuário não-root para segurança
- Health checks configurados
- Porta 3000 exposta

### 2. **Dockerfile.dev** (Desenvolvimento)
- Ambiente de desenvolvimento
- Hot reload habilitado
- Volumes para desenvolvimento local

### 3. **docker-compose.yml**
- Backend + PostgreSQL
- Configuração para produção e desenvolvimento
- Health checks para ambos os serviços
- Volumes persistentes para dados

### 4. **.dockerignore**
- Otimiza o build excluindo arquivos desnecessários
- Reduz o tamanho da imagem final

## 🚀 Deploy na Coolify

### Passo 1: Configuração do Projeto
1. Acesse o painel da Coolify
2. Clique em "New Project"
3. Selecione "Application"
4. Escolha "Docker" como tipo

### Passo 2: Configuração do Git
1. **Repository**: URL do seu repositório Git
2. **Branch**: `main` ou `master`
3. **Docker Compose**: Não marque (usaremos Dockerfile)

### Passo 3: Configuração do Build
1. **Build Pack**: `Dockerfile`
2. **Dockerfile Path**: `backend/Dockerfile`
3. **Port**: `3003`
4. **Health Check Path**: `/health`

### Passo 4: Variáveis de Ambiente
Configure as seguintes variáveis:

```bash
NODE_ENV=production
DATABASE_HOST=seu_host_postgres
DATABASE_PORT=5432
DATABASE_NAME=sistema_vendas
DATABASE_USER=seu_usuario
DATABASE_PASSWORD=sua_senha
JWT_SECRET=seu_jwt_secret_super_seguro
RESEND_API_KEY=sua_resend_api_key
```

### Passo 5: Deploy
1. Clique em "Deploy"
2. Aguarde o build e deploy
3. Verifique os logs se houver erros

## 🔧 Configurações Importantes

### Porta
- **Backend**: 3003 (conforme solicitado)
- **Desenvolvimento**: 3004

### Health Check
- Endpoint: `/health`
- Intervalo: 30s
- Timeout: 3s
- Retries: 3

### Banco de Dados
- **Host**: Configurar via variável de ambiente
- **Porta**: 5432 (PostgreSQL padrão)
- **Nome**: sistema_vendas
- **Usuário**: postgres (ou personalizado)

## 🧪 Teste Local

### Build da Imagem
```bash
cd backend
docker build -t sistema-vendas-backend .
```

### Executar Container
```bash
docker run -p 3000:3000 sistema-vendas-backend
```

### Usar Docker Compose
```bash
# Produção (Backend + PostgreSQL)
docker-compose up

# Desenvolvimento
docker-compose --profile dev up backend-dev
```

## 📊 Monitoramento

### Logs
- **Backend**: Logs da aplicação NestJS
- **PostgreSQL**: Logs do banco de dados

### Health Check
- Endpoint: `http://localhost:3003/health`
- Resposta esperada: `healthy`

### Métricas
- Porta 3003 exposta
- Headers de segurança configurados
- Usuário não-root para segurança

## 🚨 Troubleshooting

### Problema: Porta 3003 não acessível
**Solução**: Verifique se a porta está sendo exposta corretamente no Dockerfile

### Problema: Build falha
**Solução**: Verifique se todas as dependências estão no package.json

### Problema: Conexão com banco falha
**Solução**: Verifique as variáveis de ambiente do banco de dados

### Problema: Health check falha
**Solução**: Verifique se o endpoint `/health` está implementado na aplicação

## 🔒 Segurança

### Configurações Implementadas
- Usuário não-root (nestjs:1001)
- Headers de segurança no Nginx
- Variáveis de ambiente para credenciais
- Health checks para monitoramento

### Variáveis Sensíveis
- `JWT_SECRET`: Chave secreta para JWT
- `DATABASE_PASSWORD`: Senha do banco de dados
- `RESEND_API_KEY`: Chave da API do Resend

## 📈 Performance

### Otimizações Implementadas
- Multi-stage build para reduzir tamanho da imagem
- Dependências de produção apenas no container final
- Cache limpo para reduzir tamanho
- Alpine Linux para imagens menores

### Tamanho da Imagem
- **Builder**: ~1GB (temporário)
- **Produção**: ~200MB (final)

## 🎯 Próximos Passos

1. **Deploy na Coolify** seguindo os passos acima
2. **Configurar banco de dados** externo
3. **Configurar domínio** se necessário
4. **Configurar SSL** na Coolify
5. **Monitorar logs** e performance
6. **Configurar backup** do banco de dados

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs da Coolify
2. Teste localmente com Docker
3. Verifique a configuração do banco de dados
4. Consulte a documentação da Coolify

## 🔗 Integração com Frontend

### Configuração do Frontend
No frontend, configure a variável:
```bash
VITE_API_URL=http://seu-backend:3003
```

### CORS
O backend já está configurado para aceitar requisições do frontend.

---

**🎉 Deploy do backend configurado e pronto para uso na porta 3003!**

