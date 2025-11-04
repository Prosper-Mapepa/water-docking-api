import { PartialType } from '@nestjs/swagger';
import { CreateFeedbackDto } from './create-feedback.dto';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {
  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  reviewed?: boolean;

  @ApiPropertyOptional({ example: 'Thank you for your feedback!' })
  @IsString()
  @IsOptional()
  staffResponse?: string;
}










