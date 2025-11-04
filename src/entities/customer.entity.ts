import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Visit } from './visit.entity';
import { ServiceRequest } from './service-request.entity';
import { Feedback } from './feedback.entity';

export enum MembershipTier {
  BASIC = 'BASIC',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: MembershipTier,
    default: MembershipTier.BASIC,
  })
  membershipTier: MembershipTier;

  @Column({ type: 'int', default: 0 })
  loyaltyPoints: number;

  @Column({ type: 'jsonb', nullable: true })
  preferences: {
    dockSize?: string;
    powerRequirements?: string;
    notifications?: boolean;
    preferredServices?: string[];
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => Visit, (visit) => visit.customer)
  visits: Visit[];

  @OneToMany(() => ServiceRequest, (request) => request.customer)
  serviceRequests: ServiceRequest[];

  @OneToMany(() => Feedback, (feedback) => feedback.customer)
  feedback: Feedback[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



