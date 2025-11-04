import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../entities/customer.entity';
import { Visit } from '../../entities/visit.entity';
import { ServiceRequest, ServiceRequestStatus } from '../../entities/service-request.entity';
import { Feedback } from '../../entities/feedback.entity';
import { MaintenanceRecord } from '../../entities/maintenance-record.entity';
import { Dock } from '../../entities/dock.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(Visit)
    private visitsRepository: Repository<Visit>,
    @InjectRepository(ServiceRequest)
    private serviceRequestsRepository: Repository<ServiceRequest>,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(MaintenanceRecord)
    private maintenanceRepository: Repository<MaintenanceRecord>,
    @InjectRepository(Dock)
    private docksRepository: Repository<Dock>,
  ) {}

  async getDashboardOverview() {
    // Current period (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const previousPeriodStart = new Date(thirtyDaysAgo);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);

    // Current counts
    const totalCustomers = await this.customersRepository.count();
    const activeVisits = await this.visitsRepository.count({
      where: { checkOutTime: null },
    });
    const pendingRequests = await this.serviceRequestsRepository.count({
      where: { status: ServiceRequestStatus.PENDING },
    });
    const unreviewedFeedback = await this.feedbackRepository.count({
      where: { reviewed: false },
    });

    // Count docks from docks table
    const totalDocks = await this.docksRepository.count();

    // Previous period counts for comparison (30-60 days ago)
    const previousCustomers = await this.customersRepository
      .createQueryBuilder('customer')
      .where('customer.createdAt < :thirtyDaysAgo', { thirtyDaysAgo })
      .andWhere('customer.createdAt >= :previousPeriodStart', { previousPeriodStart })
      .getCount();

    // Current period new customers (last 30 days)
    const currentCustomersAdded = await this.customersRepository
      .createQueryBuilder('customer')
      .where('customer.createdAt >= :thirtyDaysAgo', { thirtyDaysAgo })
      .getCount();

    // For visits, requests, and feedback, compare current state with previous period state
    // Get snapshot at 30 days ago (what it was then)
    const previousVisitsSnapshot = await this.visitsRepository
      .createQueryBuilder('visit')
      .where('visit.checkInTime <= :thirtyDaysAgo', { thirtyDaysAgo })
      .andWhere('visit.checkOutTime IS NULL')
      .getCount();

    const previousPendingRequestsSnapshot = await this.serviceRequestsRepository
      .createQueryBuilder('request')
      .where('request.createdAt <= :thirtyDaysAgo', { thirtyDaysAgo })
      .andWhere('request.status = :status', { status: ServiceRequestStatus.PENDING })
      .getCount();

    const previousUnreviewedFeedbackSnapshot = await this.feedbackRepository
      .createQueryBuilder('feedback')
      .where('feedback.createdAt <= :thirtyDaysAgo', { thirtyDaysAgo })
      .andWhere('feedback.reviewed = false')
      .getCount();

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number): { value: string; type: 'positive' | 'negative' } => {
      if (previous === 0) {
        return current > 0 ? { value: `+${current}`, type: 'positive' } : { value: '0%', type: 'positive' };
      }
      const change = ((current - previous) / previous) * 100;
      const rounded = Math.round(change * 10) / 10;
      return {
        value: `${rounded >= 0 ? '+' : ''}${rounded}%`,
        type: rounded >= 0 ? 'positive' : 'negative',
      };
    };

    // For customers, compare new customers added in current period vs previous period
    const customersChange = calculateChange(currentCustomersAdded, previousCustomers);
    // For others, compare current state vs state 30 days ago
    const visitsChange = calculateChange(activeVisits, previousVisitsSnapshot);
    const requestsChange = calculateChange(pendingRequests, previousPendingRequestsSnapshot);
    const feedbackChange = calculateChange(unreviewedFeedback, previousUnreviewedFeedbackSnapshot);

    return {
      totalCustomers,
      activeVisits,
      pendingRequests,
      unreviewedFeedback,
      totalDocks,
      customersChange: customersChange.value,
      customersChangeType: customersChange.type,
      visitsChange: visitsChange.value,
      visitsChangeType: visitsChange.type,
      requestsChange: requestsChange.value,
      requestsChangeType: requestsChange.type,
      feedbackChange: feedbackChange.value,
      feedbackChangeType: feedbackChange.type,
    };
  }

  async getRevenueAnalytics(startDate?: Date, endDate?: Date) {
    const query = this.visitsRepository.createQueryBuilder('visit');

    if (startDate) {
      query.andWhere('visit.checkInTime >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('visit.checkInTime <= :endDate', { endDate });
    }

    const result = await query
      .select('SUM(visit.serviceCharges)', 'totalRevenue')
      .addSelect('COUNT(visit.id)', 'totalVisits')
      .addSelect('AVG(visit.serviceCharges)', 'averageRevenue')
      .getRawOne();

    return {
      totalRevenue: parseFloat(result.totalRevenue) || 0,
      totalVisits: parseInt(result.totalVisits) || 0,
      averageRevenue: parseFloat(result.averageRevenue) || 0,
    };
  }

  async getCustomerInsights() {
    const membershipDistribution = await this.customersRepository
      .createQueryBuilder('customer')
      .select('customer.membershipTier', 'tier')
      .addSelect('COUNT(*)', 'count')
      .groupBy('customer.membershipTier')
      .getRawMany();

    const topCustomers = await this.customersRepository
      .createQueryBuilder('customer')
      .leftJoin('customer.visits', 'visit')
      .select('customer.id', 'id')
      .addSelect('customer.firstName', 'firstName')
      .addSelect('customer.lastName', 'lastName')
      .addSelect('customer.membershipTier', 'membershipTier')
      .addSelect('COUNT(visit.id)', 'visitCount')
      .addSelect('SUM(visit.serviceCharges)', 'totalSpent')
      .groupBy('customer.id')
      .addGroupBy('customer.firstName')
      .addGroupBy('customer.lastName')
      .addGroupBy('customer.membershipTier')
      .orderBy('COUNT(visit.id)', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      membershipDistribution,
      topCustomers,
    };
  }

  async getServiceAnalytics() {
    const requestsByType = await this.serviceRequestsRepository
      .createQueryBuilder('request')
      .select('request.serviceType', 'serviceType')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(request.actualCost)', 'avgCost')
      .groupBy('request.serviceType')
      .getRawMany();

    const requestsByStatus = await this.serviceRequestsRepository
      .createQueryBuilder('request')
      .select('request.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('request.status')
      .getRawMany();

    return {
      requestsByType,
      requestsByStatus,
    };
  }

  async getMaintenanceAnalytics(months: number = 12) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const maintenanceByType = await this.maintenanceRepository
      .createQueryBuilder('maintenance')
      .select('maintenance.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(maintenance.actualCost)', 'totalCost')
      .where('maintenance.completedDate >= :startDate', { startDate })
      .groupBy('maintenance.type')
      .getRawMany();

    const monthlySpending = await this.maintenanceRepository
      .createQueryBuilder('maintenance')
      .select("TO_CHAR(maintenance.completedDate, 'YYYY-MM')", 'month')
      .addSelect('SUM(maintenance.actualCost)', 'totalCost')
      .addSelect('COUNT(*)', 'count')
      .where('maintenance.completedDate >= :startDate', { startDate })
      .andWhere('maintenance.actualCost IS NOT NULL')
      .groupBy("TO_CHAR(maintenance.completedDate, 'YYYY-MM')")
      .orderBy("TO_CHAR(maintenance.completedDate, 'YYYY-MM')", 'ASC')
      .getRawMany();

    return {
      maintenanceByType,
      monthlySpending,
    };
  }

  async getOccupancyRate() {
    // Count total docks from docks table
    const totalDocks = await this.docksRepository.count();

    if (totalDocks === 0) {
      return {
        totalDocks: 0,
        occupiedDocks: 0,
        availableDocks: 0,
        occupancyRate: 0,
        maintenanceDocks: 0,
        outOfServiceDocks: 0,
      };
    }

    // Get all docks with their status
    const allDocks = await this.docksRepository.find({
      select: ['dockNumber', 'status'],
    });
    const validDockNumbers = allDocks.map((dock) => dock.dockNumber);

    if (validDockNumbers.length === 0) {
      return {
        totalDocks,
        occupiedDocks: 0,
        availableDocks: totalDocks,
        occupancyRate: 0,
        maintenanceDocks: 0,
        outOfServiceDocks: 0,
      };
    }

    // Count docks by status
    const docksByStatus = allDocks.reduce((acc, dock) => {
      acc[dock.status] = (acc[dock.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const maintenanceDocks = docksByStatus['MAINTENANCE'] || 0;
    const outOfServiceDocks = docksByStatus['OUT_OF_SERVICE'] || 0;
    const statusOccupiedDocks = docksByStatus['OCCUPIED'] || 0;

    // Count unique dock numbers that are currently occupied (have active visits)
    // Only count visits where dockNumber matches an existing dock
    const occupiedDockNumbers = await this.visitsRepository
      .createQueryBuilder('visit')
      .select('DISTINCT visit.dockNumber', 'dockNumber')
      .where('visit.checkOutTime IS NULL')
      .andWhere('visit.dockNumber IN (:...validDockNumbers)', {
        validDockNumbers,
      })
      .getRawMany();

    const visitOccupiedDockNumbers = occupiedDockNumbers.map((v) => v.dockNumber);

    // Count docks that are occupied either by status or by active visits
    // A dock can be marked as OCCUPIED in status OR have an active visit
    const occupiedDockSet = new Set<string>();
    
    // Add docks marked as OCCUPIED
    allDocks
      .filter((dock) => dock.status === 'OCCUPIED')
      .forEach((dock) => occupiedDockSet.add(dock.dockNumber));

    // Add docks with active visits
    visitOccupiedDockNumbers.forEach((dockNumber) => {
      occupiedDockSet.add(dockNumber);
    });

    const actualOccupied = Math.min(occupiedDockSet.size, totalDocks);

    // Available docks are only those with status AVAILABLE and no active visit
    const availableDocks = allDocks.filter(
      (dock) =>
        dock.status === 'AVAILABLE' && !visitOccupiedDockNumbers.includes(dock.dockNumber),
    ).length;

    // Calculate occupancy rate based on operational docks (excluding maintenance and out of service)
    const operationalDocks = totalDocks - maintenanceDocks - outOfServiceDocks;
    const occupancyRate =
      operationalDocks > 0
        ? Math.min(100, Math.round(((actualOccupied / operationalDocks) * 100) * 100) / 100)
        : 0;

    return {
      totalDocks,
      occupiedDocks: actualOccupied,
      availableDocks,
      maintenanceDocks,
      outOfServiceDocks,
      occupancyRate,
    };
  }
}


