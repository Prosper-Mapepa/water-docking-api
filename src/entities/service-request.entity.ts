import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

export enum ServiceRequestStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ServiceRequestPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity('service_requests')
export class ServiceRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.serviceRequests)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @Column()
  serviceType: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  title: string;

  @Column({
    type: 'enum',
    enum: ServiceRequestStatus,
    default: ServiceRequestStatus.PENDING,
  })
  status: ServiceRequestStatus;

  @Column({
    type: 'enum',
    enum: ServiceRequestPriority,
    default: ServiceRequestPriority.MEDIUM,
  })
  priority: ServiceRequestPriority;

  @Column({ type: 'timestamp', nullable: true })
  scheduledDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  requestedDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCost: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



