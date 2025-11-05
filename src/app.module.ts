import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { VisitsModule } from './modules/visits/visits.module';
import { ServiceRequestsModule } from './modules/service-requests/service-requests.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { AssetsModule } from './modules/assets/assets.module';
import { DocksModule } from './modules/docks/docks.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432'),
      username: process.env.PGUSER || process.env.DB_USERNAME || 'postgres',
      password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
      database: process.env.PGDATABASE || process.env.DB_DATABASE || 'water_docking',
      url: process.env.DATABASE_URL, // Railway may provide DATABASE_URL
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // Always use migrations - never auto-sync in production
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: process.env.RUN_MIGRATIONS === 'true', // Set RUN_MIGRATIONS=true to auto-run migrations
      logging: process.env.NODE_ENV === 'development',
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    CustomersModule,
    VisitsModule,
    ServiceRequestsModule,
    FeedbackModule,
    AssetsModule,
    DocksModule,
    MaintenanceModule,
    AnalyticsModule,
    FileUploadModule,
  ],
})
export class AppModule {}

