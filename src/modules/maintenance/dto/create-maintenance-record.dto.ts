import { IsString, IsOptional, IsDateString, IsNumber, IsEnum, IsUUID, IsArray, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaintenanceType, MaintenanceStatus } from '../../../entities/maintenance-record.entity';

export class CreateMaintenanceRecordDto {
  @ApiPropertyOptional({ example: 'uuid-asset-id' })
  @IsUUID()
  @ValidateIf((o) => !o.dockId)
  @IsOptional()
  assetId?: string;

  @ApiPropertyOptional({ example: 'uuid-dock-id' })
  @IsUUID()
  @ValidateIf((o) => !o.assetId)
  @IsOptional()
  dockId?: string;

  @ApiProperty({ enum: MaintenanceType })
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @ApiProperty({ example: 'Quarterly Dock Inspection' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Inspect all cleats, bolts, and structural integrity' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ enum: MaintenanceStatus, default: MaintenanceStatus.SCHEDULED })
  @IsEnum(MaintenanceStatus)
  @IsOptional()
  status?: MaintenanceStatus;

  @ApiProperty({ example: '2024-01-20T09:00:00Z' })
  @IsDateString()
  scheduledDate: string;

  @ApiPropertyOptional({ example: 'John Smith' })
  @IsString()
  @IsOptional()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 500.00 })
  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @ApiPropertyOptional({ example: 'Check for rust and corrosion' })
  @IsString()
  @IsOptional()
  notes?: string;
}








