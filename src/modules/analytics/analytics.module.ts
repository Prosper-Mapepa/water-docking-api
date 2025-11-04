import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Customer } from '../../entities/customer.entity';
import { Visit } from '../../entities/visit.entity';
import { ServiceRequest } from '../../entities/service-request.entity';
import { Feedback } from '../../entities/feedback.entity';
import { MaintenanceRecord } from '../../entities/maintenance-record.entity';
import { Dock } from '../../entities/dock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Visit,
      ServiceRequest,
      Feedback,
      MaintenanceRecord,
      Dock,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}








