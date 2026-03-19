import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './src/app.module';

let cachedApp: any;

async function createApp() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn'] });

  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
    optionsSuccessStatus: 204,
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
  try {
    if (!cachedApp) {
      cachedApp = await createApp();
    }
    const httpAdapter = cachedApp.getHttpAdapter().getInstance();
    httpAdapter(req, res);
  } catch (error) {
    console.error('Error in serverless handler:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
}



