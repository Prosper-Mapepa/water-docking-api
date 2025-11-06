import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with proper configuration
  // Read from FRONTEND_URL environment variable, fallback to default
  const corsOrigin = process.env.FRONTEND_URL || 'https://water-docking-app.netlify.app';

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Water Docking Management System')
    .setDescription(
      'API for managing water docking business operations including CRM and maintenance',
    )
    .setVersion('1.0')
    .addTag('Customers')
    .addTag('Visits')
    .addTag('Service Requests')
    .addTag('Feedback')
    .addTag('Assets')
    .addTag('Maintenance')
    .addTag('Analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Use `PORT` provided in environment or default to 3000
  const port = process.env.PORT || 3000;

  // Listen on `port` and 0.0.0.0
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();










