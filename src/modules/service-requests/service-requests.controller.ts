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
import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ServiceRequestStatus } from '../../entities/service-request.entity';

@ApiTags('Service Requests')
@Controller('service-requests')
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service request' })
  @ApiResponse({ status: 201, description: 'Service request created successfully' })
  create(@Body() createServiceRequestDto: CreateServiceRequestDto) {
    return this.serviceRequestsService.create(createServiceRequestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all service requests' })
  @ApiResponse({ status: 200, description: 'Return all service requests' })
  findAll(
    @Query('customerId') customerId?: string,
    @Query('status') status?: ServiceRequestStatus,
  ) {
    if (customerId) {
      return this.serviceRequestsService.findByCustomer(customerId);
    }
    if (status) {
      return this.serviceRequestsService.findByStatus(status);
    }
    return this.serviceRequestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service request by ID' })
  @ApiResponse({ status: 200, description: 'Return a service request' })
  findOne(@Param('id') id: string) {
    return this.serviceRequestsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service request' })
  @ApiResponse({ status: 200, description: 'Service request updated successfully' })
  update(@Param('id') id: string, @Body() updateServiceRequestDto: UpdateServiceRequestDto) {
    return this.serviceRequestsService.update(id, updateServiceRequestDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service request' })
  @ApiResponse({ status: 200, description: 'Service request deleted successfully' })
  remove(@Param('id') id: string) {
    return this.serviceRequestsService.remove(id);
  }
}



