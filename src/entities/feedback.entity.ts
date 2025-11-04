import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

export enum FeedbackCategory {
  SERVICE_QUALITY = 'SERVICE_QUALITY',
  FACILITIES = 'FACILITIES',
  STAFF = 'STAFF',
  PRICING = 'PRICING',
  GENERAL = 'GENERAL',
}

export enum SentimentScore {
  VERY_NEGATIVE = 1,
  NEGATIVE = 2,
  NEUTRAL = 3,
  POSITIVE = 4,
  VERY_POSITIVE = 5,
}

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.feedback)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @Column({
    type: 'enum',
    enum: FeedbackCategory,
    default: FeedbackCategory.GENERAL,
  })
  category: FeedbackCategory;

  @Column({ type: 'int', nullable: true })
  rating: number; // 1-5 scale

  @Column({ type: 'text' })
  comments: string;

  @Column({
    type: 'enum',
    enum: SentimentScore,
    nullable: true,
  })
  sentimentScore: SentimentScore;

  @Column({ default: false })
  reviewed: boolean;

  @Column({ type: 'text', nullable: true })
  staffResponse: string;

  @CreateDateColumn()
  createdAt: Date;
}



