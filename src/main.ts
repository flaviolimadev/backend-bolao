// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar limite de tamanho para uploads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  
  // Configurar multer para uploads
  app.use(express.raw({ type: 'multipart/form-data', limit: '10mb' }));
  
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const swagger = new DocumentBuilder().setTitle('Base Backend').setVersion('1.0.0').build();
  SwaggerModule.setup('/docs', app, SwaggerModule.createDocument(app, swagger));

  // 👇 executa migrations programaticamente
  const dataSource = app.get(DataSource);
  try {
    const ran = await dataSource.runMigrations();
    if (ran.length) {
      console.log(`Migrations aplicadas: ${ran.map(m => m.name).join(', ')}`);
    } else {
      console.log('Nenhuma migration pendente.');
    }
  } catch (err) {
    console.error('Falha ao executar migrations:', err);
    process.exit(1); // opcional: falhar o boot se migration falhar
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
