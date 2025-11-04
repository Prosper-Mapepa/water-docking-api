import { PartialType } from '@nestjs/swagger';
import { CreateMaintenanceRecordDto } from './create-maintenance-record.dto';
import { IsDateString, IsNumber, IsString, IsOptional, IsArray, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMaintenanceRecordDto extends PartialType(CreateMaintenanceRecordDto) {
  @ApiPropertyOptional({ example: '2024-01-21T14:30:00Z' })
  @IsDateString()
  @IsOptional()
  completedDate?: string;

  @ApiPropertyOptional({ example: 475.00 })
  @IsNumber()
  @IsOptional()
  actualCost?: number;

  @ApiPropertyOptional({ example: 'Replaced 3 cleats, tightened all bolts' })
  @IsString()
  @IsOptional()
  workPerformed?: string;

  @ApiPropertyOptional({ example: '3x Stainless steel cleats, 12x bolts' })
  @IsString()
  @IsOptional()
  partsReplaced?: string;

  @ApiPropertyOptional({ example: ['photo1.jpg', 'photo2.jpg'] })
  @IsArray()
  @IsOptional()
  photos?: string[];

  @ApiPropertyOptional({ example: 6 })
  @IsInt()
  @IsOptional()
  laborHours?: number;
}










