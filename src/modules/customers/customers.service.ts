import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, MembershipTier } from '../../entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customersRepository.create(createCustomerDto);
    return await this.customersRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customersRepository.find({
      relations: ['visits', 'serviceRequests', 'feedback'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['visits', 'serviceRequests', 'feedback'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    return await this.customersRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customersRepository.remove(customer);
  }

  async addLoyaltyPoints(id: string, points: number): Promise<Customer> {
    const customer = await this.findOne(id);
    customer.loyaltyPoints += points;

    // Auto-upgrade membership based on points
    if (customer.loyaltyPoints >= 1000 && customer.membershipTier === MembershipTier.BASIC) {
      customer.membershipTier = MembershipTier.SILVER;
    } else if (customer.loyaltyPoints >= 2500 && customer.membershipTier === MembershipTier.SILVER) {
      customer.membershipTier = MembershipTier.GOLD;
    } else if (customer.loyaltyPoints >= 5000 && customer.membershipTier === MembershipTier.GOLD) {
      customer.membershipTier = MembershipTier.PLATINUM;
    }

    return await this.customersRepository.save(customer);
  }

  async searchCustomers(searchTerm: string): Promise<Customer[]> {
    return await this.customersRepository
      .createQueryBuilder('customer')
      .where('customer.firstName ILIKE :search', { search: `%${searchTerm}%` })
      .orWhere('customer.lastName ILIKE :search', { search: `%${searchTerm}%` })
      .orWhere('customer.email ILIKE :search', { search: `%${searchTerm}%` })
      .orWhere('customer.phone ILIKE :search', { search: `%${searchTerm}%` })
      .getMany();
  }
}



