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
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from './dto/update-maintenance-record.dto';
import { MaintenanceStatus } from '../../entities/maintenance-record.entity';

@ApiTags('Maintenance')
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new maintenance record' })
  @ApiResponse({ status: 201, description: 'Maintenance record created successfully' })
  create(@Body() createMaintenanceRecordDto: CreateMaintenanceRecordDto) {
    return this.maintenanceService.create(createMaintenanceRecordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all maintenance records' })
  @ApiResponse({ status: 200, description: 'Return all maintenance records' })
  findAll(
    @Query('assetId') assetId?: string,
    @Query('status') status?: MaintenanceStatus,
  ) {
    if (assetId) {
      return this.maintenanceService.findByAsset(assetId);
    }
    if (status) {
      return this.maintenanceService.findByStatus(status);
    }
    return this.maintenanceService.findAll();
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming maintenance' })
  @ApiResponse({ status: 200, description: 'Return upcoming maintenance' })
  getUpcoming() {
    return this.maintenanceService.findUpcoming();
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Get overdue maintenance' })
  @ApiResponse({ status: 200, description: 'Return overdue maintenance' })
  getOverdue() {
    return this.maintenanceService.findOverdue();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get maintenance statistics' })
  @ApiResponse({ status: 200, description: 'Return maintenance statistics' })
  getStats() {
    return this.maintenanceService.getMaintenanceStats();
  }

  @Get('predict-costs')
  @ApiOperation({ summary: 'Predict future maintenance costs' })
  @ApiResponse({ status: 200, description: 'Return cost predictions' })
  predictCosts(@Query('months') months?: number) {
    return this.maintenanceService.predictMaintenanceCosts(months ? parseInt(months.toString()) : 6);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a maintenance record by ID' })
  @ApiResponse({ status: 200, description: 'Return a maintenance record' })
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a maintenance record' })
  @ApiResponse({ status: 200, description: 'Maintenance record updated successfully' })
  update(@Param('id') id: string, @Body() updateMaintenanceRecordDto: UpdateMaintenanceRecordDto) {
    return this.maintenanceService.update(id, updateMaintenanceRecordDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a maintenance record' })
  @ApiResponse({ status: 200, description: 'Maintenance record deleted successfully' })
  remove(@Param('id') id: string) {
    return this.maintenanceService.remove(id);
  }
}










