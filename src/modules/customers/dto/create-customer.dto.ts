import { IsString, IsEmail, IsOptional, IsEnum, IsInt, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MembershipTier } from '../../../entities/customer.entity';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Marina Blvd' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ enum: MembershipTier, default: MembershipTier.BASIC })
  @IsEnum(MembershipTier)
  @IsOptional()
  membershipTier?: MembershipTier;

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @IsOptional()
  loyaltyPoints?: number;

  @ApiPropertyOptional({
    example: {
      dockSize: 'large',
      powerRequirements: '50A',
      notifications: true,
      preferredServices: ['fuel', 'water'],
    },
  })
  @IsObject()
  @IsOptional()
  preferences?: {
    dockSize?: string;
    powerRequirements?: string;
    notifications?: boolean;
    preferredServices?: string[];
  };

  @ApiPropertyOptional({ example: 'Regular customer, prefers morning docking' })
  @IsString()
  @IsOptional()
  notes?: string;
}



