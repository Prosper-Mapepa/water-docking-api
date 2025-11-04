import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MaintenanceRecord } from './maintenance-record.entity';

export enum AssetType {
  DOCK = 'DOCK',
  POWER_STATION = 'POWER_STATION',
  WATER_SYSTEM = 'WATER_SYSTEM',
  FUEL_STATION = 'FUEL_STATION',
  EQUIPMENT = 'EQUIPMENT',
  BUILDING = 'BUILDING',
  OTHER = 'OTHER',
}

export enum AssetStatus {
  OPERATIONAL = 'OPERATIONAL',
  MAINTENANCE_REQUIRED = 'MAINTENANCE_REQUIRED',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: AssetType,
  })
  type: AssetType;

  @Column({ nullable: true })
  identifier: string; // e.g., Dock #5, Power Station A

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({
    type: 'enum',
    enum: AssetStatus,
    default: AssetStatus.OPERATIONAL,
  })
  status: AssetStatus;

  @Column({ type: 'date', nullable: true })
  purchaseDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchasePrice: number;

  @Column({ type: 'date', nullable: true })
  warrantyExpiration: Date;

  @Column({ type: 'date', nullable: true })
  warrantyExpiry: Date;

  @Column({ type: 'int', nullable: true })
  expectedLifespanYears: number;

  @Column({ type: 'jsonb', nullable: true })
  specifications: Record<string, any>;

  @Column({ type: 'int', nullable: true })
  maintenanceInterval: number;

  @Column({ type: 'date', nullable: true })
  lastMaintenanceDate: Date;

  @Column({ type: 'date', nullable: true })
  nextMaintenanceDate: Date;

  @OneToMany(() => MaintenanceRecord, (record) => record.asset)
  maintenanceRecords: MaintenanceRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



