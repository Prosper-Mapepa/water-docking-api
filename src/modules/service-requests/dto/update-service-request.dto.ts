import { PartialType } from '@nestjs/swagger';
import { CreateServiceRequestDto } from './create-service-request.dto';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServiceRequestDto extends PartialType(CreateServiceRequestDto) {
  @ApiPropertyOptional({ example: '2024-01-21T16:00:00Z' })
  @IsDateString()
  @IsOptional()
  completedDate?: string;

  @ApiPropertyOptional({ example: 275.00 })
  @IsNumber()
  @IsOptional()
  actualCost?: number;
}



