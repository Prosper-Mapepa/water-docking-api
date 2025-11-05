import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function runMigrations() {
  // Create a separate DataSource instance for migrations to avoid conflicts
  const migrationDataSource = new DataSource({
    type: 'postgres',
    host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432'),
    username: process.env.PGUSER || process.env.DB_USERNAME || 'postgres',
    password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
    database: process.env.PGDATABASE || process.env.DB_DATABASE || 'water_docking',
    url: process.env.DATABASE_URL,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    synchronize: false,
    logging: false, // Disable logging for migrations
  });

  try {
    console.log('🚀 Running database migrations...');
    await migrationDataSource.initialize();
    
    const migrations = await migrationDataSource.runMigrations();
    
    if (migrations.length > 0) {
      console.log(`✅ Successfully ran ${migrations.length} migration(s):`);
      migrations.forEach(migration => {
        console.log(`   - ${migration.name}`);
      });
    } else {
      console.log('✅ Database is up to date - no migrations needed');
    }
    
    await migrationDataSource.destroy();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
    if (migrationDataSource.isInitialized) {
      await migrationDataSource.destroy().catch(() => {});
    }
    throw error;
  }
}

async function bootstrap() {
  // Run migrations before starting the app
  try {
    await runMigrations();
  } catch (error) {
    console.error('⚠️  Failed to run migrations, but continuing startup...');
    console.error('You may need to run migrations manually: npm run migration:run');
  }

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

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

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();

