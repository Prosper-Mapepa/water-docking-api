import { IsString, IsOptional, IsInt, IsEnum, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FeedbackCategory, SentimentScore } from '../../../entities/feedback.entity';

export class CreateFeedbackDto {
  @ApiProperty({ example: 'uuid-customer-id' })
  @IsUUID()
  customerId: string;

  @ApiPropertyOptional({ enum: FeedbackCategory, default: FeedbackCategory.GENERAL })
  @IsEnum(FeedbackCategory)
  @IsOptional()
  category?: FeedbackCategory;

  @ApiPropertyOptional({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: 'Great service, very friendly staff!' })
  @IsString()
  comments: string;

  @ApiPropertyOptional({ enum: SentimentScore })
  @IsEnum(SentimentScore)
  @IsOptional()
  sentimentScore?: SentimentScore;
}










