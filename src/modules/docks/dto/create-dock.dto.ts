import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DockStatus, DockSize } from '../../../entities/dock.entity';

export class CreateDockDto {
  @ApiProperty({ example: 'DOCK-001' })
  @IsString()
  dockNumber: string;

  @ApiProperty({ example: 'Main Dock A-12' })
  @IsString()
  name: string;

  @ApiProperty({ enum: DockSize, default: DockSize.MEDIUM })
  @IsEnum(DockSize)
  size: DockSize;

  @ApiPropertyOptional({ enum: DockStatus, default: DockStatus.AVAILABLE })
  @IsEnum(DockStatus)
  @IsOptional()
  status?: DockStatus;

  @ApiPropertyOptional({ example: 'North Marina Section' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'Premium dock with full amenities' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 60.0 })
  @IsNumber()
  @IsOptional()
  maxBoatLength?: number;

  @ApiPropertyOptional({ example: 12.5 })
  @IsNumber()
  @IsOptional()
  depth?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsNumber()
  @IsOptional()
  powerAmperage?: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  hasWater?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  hasSewage?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  hasFuel?: boolean;

  @ApiPropertyOptional({
    example: {
      wifi: true,
      security: true,
      lighting: true,
      cleats: 8,
      other: ['camera', 'security_light'],
    },
  })
  @IsObject()
  @IsOptional()
  amenities?: {
    wifi?: boolean;
    security?: boolean;
    lighting?: boolean;
    cleats?: number;
    other?: string[];
  };

  @ApiPropertyOptional({ example: '2020-01-15' })
  @IsDateString()
  @IsOptional()
  builtDate?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @IsOptional()
  maintenanceInterval?: number;

  @ApiPropertyOptional({ example: 'Additional notes about this dock' })
  @IsString()
  @IsOptional()
  notes?: string;
}

