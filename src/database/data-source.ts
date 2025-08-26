// src/database/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: '108.181.224.233', // FORÇADO - IP correto
  port: 5433, // FORÇADO - Porta correta
  username: 'postgres',
  password: 'AUD45hW9SUWEGXqr3CgwuNqkONpnAN3urtZpH0A6D4cym50AtNXm17PzBgNsnP0y',
  database: 'postgres',
  synchronize: false, // SEMPRE false em produção
  logging: false, // false em produção
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
});
