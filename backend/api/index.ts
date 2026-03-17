import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

let cachedApp: any;

async function createApp() {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.init();
  return app;
}

export default async function handler(req: any, res: any) {
  console.log('Incoming request:', req.method, req.url);
  if (!cachedApp) {
    cachedApp = await createApp();
  }
  const httpAdapter = cachedApp.getHttpAdapter().getInstance();
  httpAdapter(req, res);
}
