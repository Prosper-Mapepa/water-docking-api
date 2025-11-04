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
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'water_docking',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
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

