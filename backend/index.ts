import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './src/app.module';

console.log('Serverless script loaded!');

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

  app.setGlobalPrefix('api');
  await app.init();
  return app;
}

export default async function handler(req: any, res: any) {
  console.log('Incoming request:', req.method, req.url);
  try {
    if (!cachedApp) {
      console.log('Initializing NestJS app...');
      cachedApp = await createApp();
      console.log('NestJS app initialized.');
    }
    const httpAdapter = cachedApp.getHttpAdapter().getInstance();
    httpAdapter(req, res);
  } catch (error) {
    console.error('Error in serverless handler:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      stack: error.stack
    });
  }
}


