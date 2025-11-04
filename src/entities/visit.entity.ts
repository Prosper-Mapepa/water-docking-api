import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity('visits')
export class Visit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.visits)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @Column({ type: 'timestamp' })
  checkInTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOutTime: Date;

  @Column()
  dockNumber: string;

  @Column({ nullable: true })
  boatName: string;

  @Column({ nullable: true })
  boatType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceCharges: number;

  @Column({ type: 'jsonb', nullable: true })
  servicesUsed: {
    power?: boolean;
    water?: boolean;
    waste?: boolean;
    fuel?: boolean;
    other?: string[];
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;
}



