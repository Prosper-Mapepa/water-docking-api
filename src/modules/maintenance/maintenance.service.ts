import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { MaintenanceRecord, MaintenanceStatus, MaintenanceType } from '../../entities/maintenance-record.entity';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from './dto/update-maintenance-record.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(MaintenanceRecord)
    private maintenanceRepository: Repository<MaintenanceRecord>,
  ) {}

  async create(createMaintenanceRecordDto: CreateMaintenanceRecordDto): Promise<MaintenanceRecord> {
    const maintenance = this.maintenanceRepository.create(createMaintenanceRecordDto);
    return await this.maintenanceRepository.save(maintenance);
  }

  async findAll(): Promise<MaintenanceRecord[]> {
    return await this.maintenanceRepository.find({
      relations: ['asset'],
      order: { scheduledDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<MaintenanceRecord> {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { id },
      relations: ['asset'],
    });

    if (!maintenance) {
      throw new NotFoundException(`Maintenance record with ID ${id} not found`);
    }

    return maintenance;
  }

  async findByAsset(assetId: string): Promise<MaintenanceRecord[]> {
    return await this.maintenanceRepository.find({
      where: { assetId },
      order: { scheduledDate: 'DESC' },
    });
  }

  async findByStatus(status: MaintenanceStatus): Promise<MaintenanceRecord[]> {
    return await this.maintenanceRepository.find({
      where: { status },
      relations: ['asset'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async findUpcoming(): Promise<MaintenanceRecord[]> {
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    return await this.maintenanceRepository.find({
      where: {
        status: MaintenanceStatus.SCHEDULED,
        scheduledDate: MoreThan(now),
      },
      relations: ['asset'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async findOverdue(): Promise<MaintenanceRecord[]> {
    const now = new Date();

    return await this.maintenanceRepository.find({
      where: {
        status: MaintenanceStatus.SCHEDULED,
        scheduledDate: LessThan(now),
      },
      relations: ['asset'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async update(id: string, updateMaintenanceRecordDto: UpdateMaintenanceRecordDto): Promise<MaintenanceRecord> {
    const maintenance = await this.findOne(id);
    Object.assign(maintenance, updateMaintenanceRecordDto);
    return await this.maintenanceRepository.save(maintenance);
  }

  async remove(id: string): Promise<void> {
    const maintenance = await this.findOne(id);
    await this.maintenanceRepository.remove(maintenance);
  }

  async getMaintenanceStats() {
    const total = await this.maintenanceRepository.count();
    const upcoming = await this.maintenanceRepository.count({
      where: { status: MaintenanceStatus.SCHEDULED },
    });
    const overdue = (await this.findOverdue()).length;

    const byType = await this.maintenanceRepository
      .createQueryBuilder('maintenance')
      .select('maintenance.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('maintenance.type')
      .getRawMany();

    const totalCost = await this.maintenanceRepository
      .createQueryBuilder('maintenance')
      .select('SUM(maintenance.actualCost)', 'total')
      .where('maintenance.actualCost IS NOT NULL')
      .getRawOne();

    return {
      total,
      upcoming,
      overdue,
      byType,
      totalCost: parseFloat(totalCost.total) || 0,
    };
  }

  async predictMaintenanceCosts(months: number = 6): Promise<any> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    const upcomingMaintenance = await this.maintenanceRepository
      .createQueryBuilder('maintenance')
      .where('maintenance.scheduledDate BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .getMany();

    const estimatedCost = upcomingMaintenance.reduce(
      (sum, record) => sum + (record.estimatedCost || 0),
      0,
    );

    return {
      months,
      upcomingCount: upcomingMaintenance.length,
      estimatedCost,
      breakdown: upcomingMaintenance,
    };
  }

  // Scheduled task to check for overdue maintenance (runs daily at 8 AM)
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async checkOverdueMaintenance() {
    const overdue = await this.findOverdue();
    if (overdue.length > 0) {
      console.log(`⚠️  ${overdue.length} overdue maintenance tasks found`);
      // Here you could integrate with email/SMS service to send notifications
    }
  }
}


