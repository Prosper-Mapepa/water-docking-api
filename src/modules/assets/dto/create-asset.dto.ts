import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AssetType, AssetStatus } from '../../../entities/asset.entity';

export class CreateAssetDto {
  @ApiProperty({ example: 'Main Dock A' })
  @IsString()
  name: string;

  @ApiProperty({ enum: AssetType })
  @IsEnum(AssetType)
  type: AssetType;

  @ApiPropertyOptional({ example: 'DOCK-001' })
  @IsString()
  @IsOptional()
  identifier?: string;

  @ApiPropertyOptional({ example: 'Large dock for yachts up to 60ft' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'North Marina Section' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ enum: AssetStatus, default: AssetStatus.OPERATIONAL })
  @IsEnum(AssetStatus)
  @IsOptional()
  status?: AssetStatus;

  @ApiPropertyOptional({ example: '2020-01-15' })
  @IsDateString()
  @IsOptional()
  purchaseDate?: string;

  @ApiPropertyOptional({ example: 25000.00 })
  @IsNumber()
  @IsOptional()
  purchasePrice?: number;

  @ApiPropertyOptional({ example: '2025-01-15' })
  @IsDateString()
  @IsOptional()
  warrantyExpiration?: string;

  @ApiPropertyOptional({ example: '2025-01-15' })
  @IsDateString()
  @IsOptional()
  warrantyExpiry?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsNumber()
  @IsOptional()
  expectedLifespanYears?: number;

  @ApiPropertyOptional({
    example: {
      capacity: '60ft',
      powerOutput: '50A',
      material: 'Reinforced concrete',
    },
  })
  @IsObject()
  @IsOptional()
  specifications?: Record<string, any>;

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @IsOptional()
  maintenanceInterval?: number;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsDateString()
  @IsOptional()
  lastMaintenanceDate?: string;

  @ApiPropertyOptional({ example: '2024-07-15' })
  @IsDateString()
  @IsOptional()
  nextMaintenanceDate?: string;
}




