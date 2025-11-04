import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Create new feedback' })
  @ApiResponse({ status: 201, description: 'Feedback created successfully' })
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedback' })
  @ApiResponse({ status: 200, description: 'Return all feedback' })
  findAll(@Query('customerId') customerId?: string, @Query('unreviewed') unreviewed?: string) {
    if (customerId) {
      return this.feedbackService.findByCustomer(customerId);
    }
    if (unreviewed === 'true') {
      return this.feedbackService.findUnreviewed();
    }
    return this.feedbackService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get feedback statistics' })
  @ApiResponse({ status: 200, description: 'Return feedback statistics' })
  getStats() {
    return this.feedbackService.getFeedbackStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feedback by ID' })
  @ApiResponse({ status: 200, description: 'Return a feedback' })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update feedback' })
  @ApiResponse({ status: 200, description: 'Feedback updated successfully' })
  update(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete feedback' })
  @ApiResponse({ status: 200, description: 'Feedback deleted successfully' })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }
}










