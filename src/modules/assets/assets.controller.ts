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
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AssetType, AssetStatus } from '../../entities/asset.entity';

@ApiTags('Assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully' })
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all assets' })
  @ApiResponse({ status: 200, description: 'Return all assets' })
  findAll(
    @Query('type') type?: AssetType,
    @Query('status') status?: AssetStatus,
  ) {
    if (type) {
      return this.assetsService.findByType(type);
    }
    if (status) {
      return this.assetsService.findByStatus(status);
    }
    return this.assetsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get asset statistics' })
  @ApiResponse({ status: 200, description: 'Return asset statistics' })
  getStats() {
    return this.assetsService.getAssetStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an asset by ID' })
  @ApiResponse({ status: 200, description: 'Return an asset' })
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an asset' })
  @ApiResponse({ status: 200, description: 'Asset updated successfully' })
  update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService.update(id, updateAssetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an asset' })
  @ApiResponse({ status: 200, description: 'Asset deleted successfully' })
  remove(@Param('id') id: string) {
    return this.assetsService.remove(id);
  }
}










