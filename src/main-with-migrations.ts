import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function runMigrations() {
  // Log environment variables for debugging
  console.log('🔍 Environment variables check:');
  console.log('  PGHOST:', process.env.PGHOST || 'NOT SET');
  console.log('  PGPORT:', process.env.PGPORT || 'NOT SET');
  console.log('  PGUSER:', process.env.PGUSER || 'NOT SET');
  console.log('  PGPASSWORD:', process.env.PGPASSWORD ? '***SET***' : 'NOT SET');
  console.log('  PGDATABASE:', process.env.PGDATABASE || 'NOT SET');
  console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '***SET***' : 'NOT SET');
  console.log('  DB_HOST:', process.env.DB_HOST || 'NOT SET');
  
  // Create a separate DataSource instance for migrations to avoid conflicts
  const migrationDataSource = new DataSource({
    type: 'postgres',
    host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432'),
    username: process.env.PGUSER || process.env.DB_USERNAME || 'postgres',
    password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
    database: process.env.PGDATABASE || process.env.DB_DATABASE || 'water_docking',
    url: process.env.DATABASE_URL, // Railway may provide DATABASE_URL
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    synchronize: false,
    logging: false, // Disable logging for migrations
  });

  // Log final config (without password)
  const dbConfig = {
    host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432'),
    username: process.env.PGUSER || process.env.DB_USERNAME || 'postgres',
    database: process.env.PGDATABASE || process.env.DB_DATABASE || 'water_docking',
    hasUrl: !!process.env.DATABASE_URL,
  };
  console.log('📊 Migration DataSource config:', dbConfig);

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
    // Don't throw - let the app continue even if migrations fail
    console.error('Migration error details:', error instanceof Error ? error.stack : String(error));
  }
}

async function bootstrap() {
  // Run migrations before starting the app
  try {
    await runMigrations();
  } catch (error) {
    console.error('⚠️  Failed to run migrations, but continuing startup...');
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    // Don't throw - let the app start anyway
  }

  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS with proper configuration
    const allowedOrigins = [
      'https://water-docking.netlify.app',
    ];

    console.log('🌐 Configuring CORS with allowed origins:', allowedOrigins);

    // Use simple array-based CORS configuration for better compatibility
    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'Origin',
        'X-Requested-With',
      ],
      exposedHeaders: ['Authorization'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
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

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Application is running on port ${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
    console.log(`🌐 Production API: https://water-docking-api-production.up.railway.app`);
    console.log(`📖 Swagger UI: https://water-docking-api-production.up.railway.app/api`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}
bootstrap();

