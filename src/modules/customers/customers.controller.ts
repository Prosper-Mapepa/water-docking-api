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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Return all customers' })
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.customersService.searchCustomers(search);
    }
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({ status: 200, description: 'Return a customer' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @Post(':id/loyalty-points')
  @ApiOperation({ summary: 'Add loyalty points to a customer' })
  @ApiResponse({ status: 200, description: 'Loyalty points added successfully' })
  addLoyaltyPoints(@Param('id') id: string, @Body() body: { points: number }) {
    return this.customersService.addLoyaltyPoints(id, body.points);
  }
}



