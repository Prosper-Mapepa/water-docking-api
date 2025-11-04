import { IsString, IsOptional, IsDateString, IsNumber, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceRequestStatus, ServiceRequestPriority } from '../../../entities/service-request.entity';

export class CreateServiceRequestDto {
  @ApiProperty({ example: 'uuid-customer-id' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ example: 'Dock Repair' })
  @IsString()
  serviceType: string;

  @ApiProperty({ example: 'Need to repair dock cleats' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: 'Dock Repair Request' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ enum: ServiceRequestStatus, default: ServiceRequestStatus.PENDING })
  @IsEnum(ServiceRequestStatus)
  @IsOptional()
  status?: ServiceRequestStatus;

  @ApiPropertyOptional({ enum: ServiceRequestPriority, default: ServiceRequestPriority.MEDIUM })
  @IsEnum(ServiceRequestPriority)
  @IsOptional()
  priority?: ServiceRequestPriority;

  @ApiPropertyOptional({ example: '2024-01-20T14:00:00Z' })
  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @ApiPropertyOptional({ example: '2024-01-20T14:00:00Z' })
  @IsDateString()
  @IsOptional()
  requestedDate?: string;

  @ApiPropertyOptional({ example: 250.00 })
  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @ApiPropertyOptional({ example: 'Customer prefers morning appointments' })
  @IsString()
  @IsOptional()
  notes?: string;
}



