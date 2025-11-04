import { IsString, IsOptional, IsDateString, IsNumber, IsObject, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVisitDto {
  @ApiProperty({ example: 'uuid-customer-id' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  @IsDateString()
  checkInTime: string;

  @ApiPropertyOptional({ example: '2024-01-15T18:00:00Z' })
  @IsDateString()
  @IsOptional()
  checkOutTime?: string;

  @ApiProperty({ example: 'A-15' })
  @IsString()
  dockNumber: string;

  @ApiPropertyOptional({ example: 'Sea Breeze' })
  @IsString()
  @IsOptional()
  boatName?: string;

  @ApiPropertyOptional({ example: 'Yacht' })
  @IsString()
  @IsOptional()
  boatType?: string;

  @ApiPropertyOptional({ example: 150.00 })
  @IsNumber()
  @IsOptional()
  serviceCharges?: number;

  @ApiPropertyOptional({
    example: {
      power: true,
      water: true,
      waste: false,
      fuel: true,
      other: ['wifi'],
    },
  })
  @IsObject()
  @IsOptional()
  servicesUsed?: {
    power?: boolean;
    water?: boolean;
    waste?: boolean;
    fuel?: boolean;
    other?: string[];
  };

  @ApiPropertyOptional({ example: 'Customer requested early check-in' })
  @IsString()
  @IsOptional()
  notes?: string;
}



