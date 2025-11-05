import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit - let the app continue
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Don't exit - let the app continue
});

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
  // Prioritize DATABASE_URL if available, otherwise use individual parameters
  const migrationConfig: any = {
    type: 'postgres',
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    synchronize: false,
    logging: false, // Disable logging for migrations
  };

  // If DATABASE_URL is provided, use it (Railway's preferred method)
  if (process.env.DATABASE_URL) {
    migrationConfig.url = process.env.DATABASE_URL;
    console.log('📊 Using DATABASE_URL for migrations');
  } else {
    // Fall back to individual parameters
    migrationConfig.host = process.env.PGHOST || process.env.DB_HOST || 'localhost';
    migrationConfig.port = parseInt(process.env.PGPORT || process.env.DB_PORT || '5432');
    migrationConfig.username = process.env.PGUSER || process.env.DB_USERNAME || 'postgres';
    migrationConfig.password = process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres';
    migrationConfig.database = process.env.PGDATABASE || process.env.DB_DATABASE || 'water_docking';
    console.log('📊 Using individual connection parameters for migrations');
  }

  const migrationDataSource = new DataSource(migrationConfig);

  // Log final config (without password)
  const dbConfig = {
    host: migrationConfig.host || 'from DATABASE_URL',
    port: migrationConfig.port || 'from DATABASE_URL',
    username: migrationConfig.username || 'from DATABASE_URL',
    database: migrationConfig.database || 'from DATABASE_URL',
    hasUrl: !!migrationConfig.url,
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
  console.log('🚀 Starting application bootstrap...');
  console.log('📋 Environment check:');
  console.log('  PORT:', process.env.PORT || 'NOT SET (will use 3001)');
  console.log('  NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
  
  // Run migrations before starting the app
  console.log('📦 Step 1: Running migrations...');
  try {
    await runMigrations();
    console.log('✅ Migrations completed');
  } catch (error) {
    console.error('⚠️  Failed to run migrations, but continuing startup...');
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    // Don't throw - let the app start anyway
  }

  console.log('🏗️  Step 2: Creating NestJS application...');
  let app;
  try {
    // Add a small delay to ensure database is fully ready
    console.log('⏳ Waiting 2 seconds for database to be fully ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    console.log('✅ NestJS application created');

    // Enable CORS with proper configuration - MUST be before any routes
    const allowedOrigins = [
      'https://water-docking.netlify.app',
    ];

    console.log('🌐 Configuring CORS with allowed origins:', allowedOrigins);
    console.log('🌐 Request origin will be validated against:', allowedOrigins);

    // Use simple array-based CORS configuration for better compatibility
    app.enableCors({
      origin: (origin, callback) => {
        console.log(`🔍 CORS check - Request origin: ${origin || 'none'}`);
        console.log(`🔍 CORS check - Allowed origins:`, allowedOrigins);
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
          console.log('✅ CORS: Allowing request with no origin');
          return callback(null, true);
        }
        
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
          console.log(`✅ CORS: Allowing origin: ${origin}`);
          return callback(null, true);
        }
        
        console.log(`❌ CORS: Rejecting origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      },
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
    
    console.log('✅ CORS configuration applied successfully');

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
    console.log(`🌐 Step 4: Starting server on port ${port}...`);
    
    // Ensure we listen on 0.0.0.0 to accept connections from Railway
    await app.listen(port, '0.0.0.0');
    
    console.log(`✅ Application is running on port ${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
    console.log(`🌐 Production API: https://water-docking-api-production.up.railway.app`);
    console.log(`📖 Swagger UI: https://water-docking-api-production.up.railway.app/api`);
    console.log(`✅ Application startup complete!`);
    console.log(`🔍 Listening on 0.0.0.0:${port} (accessible from Railway)`);
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }
    // Don't exit immediately - give Railway time to capture logs
    setTimeout(() => {
      console.error('💥 Exiting due to startup failure');
      process.exit(1);
    }, 5000);
  }
}

// Wrap bootstrap in try-catch to catch any top-level errors
bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error);
  if (error instanceof Error) {
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
  }
  setTimeout(() => {
    process.exit(1);
  }, 5000);
});


