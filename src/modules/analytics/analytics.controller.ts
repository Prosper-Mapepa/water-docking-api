import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard overview statistics' })
  @ApiResponse({ status: 200, description: 'Return dashboard overview' })
  getDashboard() {
    return this.analyticsService.getDashboardOverview();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  @ApiResponse({ status: 200, description: 'Return revenue analytics' })
  getRevenue(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getRevenueAnalytics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get customer insights' })
  @ApiResponse({ status: 200, description: 'Return customer insights' })
  getCustomerInsights() {
    return this.analyticsService.getCustomerInsights();
  }

  @Get('services')
  @ApiOperation({ summary: 'Get service analytics' })
  @ApiResponse({ status: 200, description: 'Return service analytics' })
  getServiceAnalytics() {
    return this.analyticsService.getServiceAnalytics();
  }

  @Get('maintenance')
  @ApiOperation({ summary: 'Get maintenance analytics' })
  @ApiResponse({ status: 200, description: 'Return maintenance analytics' })
  getMaintenanceAnalytics(@Query('months') months?: number) {
    return this.analyticsService.getMaintenanceAnalytics(
      months ? parseInt(months.toString()) : 12,
    );
  }

  @Get('occupancy')
  @ApiOperation({ summary: 'Get dock occupancy rate' })
  @ApiResponse({ status: 200, description: 'Return occupancy rate' })
  getOccupancy() {
    return this.analyticsService.getOccupancyRate();
  }
}










