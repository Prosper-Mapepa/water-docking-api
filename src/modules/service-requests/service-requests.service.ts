import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRequest, ServiceRequestStatus } from '../../entities/service-request.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';

@Injectable()
export class ServiceRequestsService {
  constructor(
    @InjectRepository(ServiceRequest)
    private serviceRequestsRepository: Repository<ServiceRequest>,
  ) {}

  async create(createServiceRequestDto: CreateServiceRequestDto): Promise<ServiceRequest> {
    const serviceRequest = this.serviceRequestsRepository.create(createServiceRequestDto);
    return await this.serviceRequestsRepository.save(serviceRequest);
  }

  async findAll(): Promise<ServiceRequest[]> {
    return await this.serviceRequestsRepository.find({
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ServiceRequest> {
    const serviceRequest = await this.serviceRequestsRepository.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!serviceRequest) {
      throw new NotFoundException(`Service request with ID ${id} not found`);
    }

    return serviceRequest;
  }

  async findByCustomer(customerId: string): Promise<ServiceRequest[]> {
    return await this.serviceRequestsRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: ServiceRequestStatus): Promise<ServiceRequest[]> {
    return await this.serviceRequestsRepository.find({
      where: { status },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateServiceRequestDto: UpdateServiceRequestDto): Promise<ServiceRequest> {
    const serviceRequest = await this.findOne(id);
    Object.assign(serviceRequest, updateServiceRequestDto);
    return await this.serviceRequestsRepository.save(serviceRequest);
  }

  async remove(id: string): Promise<void> {
    const serviceRequest = await this.findOne(id);
    await this.serviceRequestsRepository.remove(serviceRequest);
  }
}



