import { PartialType } from '@nestjs/swagger';
import { CreateDockDto } from './create-dock.dto';
import { IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDockDto extends PartialType(CreateDockDto) {
  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsDateString()
  @IsOptional()
  lastMaintenanceDate?: string;

  @ApiPropertyOptional({ example: '2024-07-15' })
  @IsDateString()
  @IsOptional()
  nextMaintenanceDate?: string;
}

