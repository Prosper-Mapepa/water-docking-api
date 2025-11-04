import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dock, DockStatus, DockSize } from '../../entities/dock.entity';
import { CreateDockDto } from './dto/create-dock.dto';
import { UpdateDockDto } from './dto/update-dock.dto';

@Injectable()
export class DocksService {
  constructor(
    @InjectRepository(Dock)
    private docksRepository: Repository<Dock>,
  ) {}

  async create(createDockDto: CreateDockDto): Promise<Dock> {
    const dock = this.docksRepository.create(createDockDto);
    return await this.docksRepository.save(dock);
  }

  async findAll(): Promise<Dock[]> {
    return await this.docksRepository.find({
      relations: ['maintenanceRecords'],
      order: { dockNumber: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Dock> {
    const dock = await this.docksRepository.findOne({
      where: { id },
      relations: ['maintenanceRecords'],
    });

    if (!dock) {
      throw new NotFoundException(`Dock with ID ${id} not found`);
    }

    return dock;
  }

  async findByStatus(status: DockStatus): Promise<Dock[]> {
    return await this.docksRepository.find({
      where: { status },
      order: { dockNumber: 'ASC' },
    });
  }

  async findBySize(size: DockSize): Promise<Dock[]> {
    return await this.docksRepository.find({
      where: { size },
      order: { dockNumber: 'ASC' },
    });
  }

  async findByDockNumber(dockNumber: string): Promise<Dock | null> {
    return await this.docksRepository.findOne({
      where: { dockNumber },
    });
  }

  async getAvailable(): Promise<Dock[]> {
    return await this.docksRepository.find({
      where: { status: DockStatus.AVAILABLE },
      order: { dockNumber: 'ASC' },
    });
  }

  async update(id: string, updateDockDto: UpdateDockDto): Promise<Dock> {
    const dock = await this.findOne(id);
    Object.assign(dock, updateDockDto);
    return await this.docksRepository.save(dock);
  }

  async remove(id: string): Promise<void> {
    const dock = await this.findOne(id);
    await this.docksRepository.remove(dock);
  }

  async getDockStats() {
    const total = await this.docksRepository.count();

    const byStatus = await this.docksRepository
      .createQueryBuilder('dock')
      .select('dock.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('dock.status')
      .getRawMany();

    const bySize = await this.docksRepository
      .createQueryBuilder('dock')
      .select('dock.size', 'size')
      .addSelect('COUNT(*)', 'count')
      .groupBy('dock.size')
      .getRawMany();

    return {
      total,
      byStatus,
      bySize,
    };
  }
}

