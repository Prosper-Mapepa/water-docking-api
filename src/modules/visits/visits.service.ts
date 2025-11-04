import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visit } from '../../entities/visit.entity';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

@Injectable()
export class VisitsService {
  constructor(
    @InjectRepository(Visit)
    private visitsRepository: Repository<Visit>,
  ) {}

  async create(createVisitDto: CreateVisitDto): Promise<Visit> {
    const visit = this.visitsRepository.create(createVisitDto);
    return await this.visitsRepository.save(visit);
  }

  async findAll(): Promise<Visit[]> {
    return await this.visitsRepository.find({
      relations: ['customer'],
      order: { checkInTime: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Visit> {
    const visit = await this.visitsRepository.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }

    return visit;
  }

  async findByCustomer(customerId: string): Promise<Visit[]> {
    return await this.visitsRepository.find({
      where: { customerId },
      order: { checkInTime: 'DESC' },
    });
  }

  async update(id: string, updateVisitDto: UpdateVisitDto): Promise<Visit> {
    const visit = await this.findOne(id);
    Object.assign(visit, updateVisitDto);
    return await this.visitsRepository.save(visit);
  }

  async remove(id: string): Promise<void> {
    const visit = await this.findOne(id);
    await this.visitsRepository.remove(visit);
  }

  async getCurrentVisits(): Promise<Visit[]> {
    return await this.visitsRepository
      .createQueryBuilder('visit')
      .leftJoinAndSelect('visit.customer', 'customer')
      .where('visit.checkOutTime IS NULL')
      .orderBy('visit.checkInTime', 'DESC')
      .getMany();
  }
}



