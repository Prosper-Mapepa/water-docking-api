import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset, AssetType, AssetStatus } from '../../entities/asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = this.assetsRepository.create(createAssetDto);
    return await this.assetsRepository.save(asset);
  }

  async findAll(): Promise<Asset[]> {
    return await this.assetsRepository.find({
      relations: ['maintenanceRecords'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Asset> {
    const asset = await this.assetsRepository.findOne({
      where: { id },
      relations: ['maintenanceRecords'],
    });

    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }

    return asset;
  }

  async findByType(type: AssetType): Promise<Asset[]> {
    return await this.assetsRepository.find({
      where: { type },
      order: { name: 'ASC' },
    });
  }

  async findByStatus(status: AssetStatus): Promise<Asset[]> {
    return await this.assetsRepository.find({
      where: { status },
      order: { name: 'ASC' },
    });
  }

  async update(id: string, updateAssetDto: UpdateAssetDto): Promise<Asset> {
    const asset = await this.findOne(id);
    Object.assign(asset, updateAssetDto);
    return await this.assetsRepository.save(asset);
  }

  async remove(id: string): Promise<void> {
    const asset = await this.findOne(id);
    await this.assetsRepository.remove(asset);
  }

  async getAssetStats() {
    const total = await this.assetsRepository.count();
    
    const byType = await this.assetsRepository
      .createQueryBuilder('asset')
      .select('asset.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('asset.type')
      .getRawMany();

    const byStatus = await this.assetsRepository
      .createQueryBuilder('asset')
      .select('asset.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('asset.status')
      .getRawMany();

    return {
      total,
      byType,
      byStatus,
    };
  }
}










