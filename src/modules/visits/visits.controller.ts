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
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

@ApiTags('Visits')
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new visit record' })
  @ApiResponse({ status: 201, description: 'Visit created successfully' })
  create(@Body() createVisitDto: CreateVisitDto) {
    return this.visitsService.create(createVisitDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all visits' })
  @ApiResponse({ status: 200, description: 'Return all visits' })
  findAll(@Query('customerId') customerId?: string) {
    if (customerId) {
      return this.visitsService.findByCustomer(customerId);
    }
    return this.visitsService.findAll();
  }

  @Get('current')
  @ApiOperation({ summary: 'Get currently active visits' })
  @ApiResponse({ status: 200, description: 'Return current visits' })
  getCurrentVisits() {
    return this.visitsService.getCurrentVisits();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a visit by ID' })
  @ApiResponse({ status: 200, description: 'Return a visit' })
  findOne(@Param('id') id: string) {
    return this.visitsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a visit' })
  @ApiResponse({ status: 200, description: 'Visit updated successfully' })
  update(@Param('id') id: string, @Body() updateVisitDto: UpdateVisitDto) {
    return this.visitsService.update(id, updateVisitDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a visit' })
  @ApiResponse({ status: 200, description: 'Visit deleted successfully' })
  remove(@Param('id') id: string) {
    return this.visitsService.remove(id);
  }
}



