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
import { DocksService } from './docks.service';
import { CreateDockDto } from './dto/create-dock.dto';
import { UpdateDockDto } from './dto/update-dock.dto';
import { DockStatus, DockSize } from '../../entities/dock.entity';

@ApiTags('Docks')
@Controller('docks')
export class DocksController {
  constructor(private readonly docksService: DocksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new dock' })
  @ApiResponse({ status: 201, description: 'Dock created successfully' })
  create(@Body() createDockDto: CreateDockDto) {
    return this.docksService.create(createDockDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all docks' })
  @ApiResponse({ status: 200, description: 'Return all docks' })
  findAll(
    @Query('status') status?: DockStatus,
    @Query('size') size?: DockSize,
    @Query('available') available?: string,
  ) {
    if (available === 'true') {
      return this.docksService.getAvailable();
    }
    if (status) {
      return this.docksService.findByStatus(status);
    }
    if (size) {
      return this.docksService.findBySize(size);
    }
    return this.docksService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get dock statistics' })
  @ApiResponse({ status: 200, description: 'Return dock statistics' })
  getStats() {
    return this.docksService.getDockStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a dock by ID' })
  @ApiResponse({ status: 200, description: 'Return a dock' })
  findOne(@Param('id') id: string) {
    return this.docksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a dock' })
  @ApiResponse({ status: 200, description: 'Dock updated successfully' })
  update(@Param('id') id: string, @Body() updateDockDto: UpdateDockDto) {
    return this.docksService.update(id, updateDockDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a dock' })
  @ApiResponse({ status: 200, description: 'Dock deleted successfully' })
  remove(@Param('id') id: string) {
    return this.docksService.remove(id);
  }
}

