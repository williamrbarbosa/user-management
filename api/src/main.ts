import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { urlencoded, json } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.enableShutdownHooks();

  const allowedOrigins = ['http://localhost:3001'];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow calls without an orgigin (e.g: cURL ou Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(
          new Error(`Origin ${origin} not allowed by CORS`),
          false,
        );
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'SessionId',
      'process-data',
      'preflight',
    ],
    credentials: true, // to send cookies
  });

  // Swagger Settings
  const config = new DocumentBuilder()
    .setTitle('Users Management System API')
    .setDescription('Documentation for Users Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // access by /docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
