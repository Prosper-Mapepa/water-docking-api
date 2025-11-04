import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MaintenanceRecord } from './maintenance-record.entity';

export enum DockStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
}

export enum DockSize {
  SMALL = 'SMALL',      // Up to 30ft
  MEDIUM = 'MEDIUM',    // 30-50ft
  LARGE = 'LARGE',      // 50-80ft
  EXTRA_LARGE = 'EXTRA_LARGE', // 80ft+
}

@Entity('docks')
export class Dock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  dockNumber: string; // e.g., "DOCK-001", "A-12"

  @Column()
  name: string; // e.g., "Main Dock A-12"

  @Column({
    type: 'enum',
    enum: DockSize,
    default: DockSize.MEDIUM,
  })
  size: DockSize;

  @Column({
    type: 'enum',
    enum: DockStatus,
    default: DockStatus.AVAILABLE,
  })
  status: DockStatus;

  @Column({ nullable: true })
  location: string; // e.g., "North Marina Section", "Pier 3"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxBoatLength: number; // Maximum boat length in feet

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  depth: number; // Water depth in feet

  @Column({ type: 'int', nullable: true })
  powerAmperage: number; // Available power in amps (e.g., 30, 50, 100)

  @Column({ default: true })
  hasWater: boolean;

  @Column({ default: false })
  hasSewage: boolean;

  @Column({ default: false })
  hasFuel: boolean;

  @Column({ type: 'jsonb', nullable: true })
  amenities: {
    wifi?: boolean;
    security?: boolean;
    lighting?: boolean;
    cleats?: number;
    other?: string[];
  };

  @Column({ type: 'date', nullable: true })
  builtDate: Date; // When the dock was built/installed

  @Column({ type: 'date', nullable: true })
  lastMaintenanceDate: Date;

  @Column({ type: 'date', nullable: true })
  nextMaintenanceDate: Date;

  @Column({ type: 'int', nullable: true })
  maintenanceInterval: number; // Days between maintenance

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => MaintenanceRecord, (record) => record.dock)
  maintenanceRecords: MaintenanceRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

