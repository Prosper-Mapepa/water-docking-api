import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Asset } from './asset.entity';
import { Dock } from './dock.entity';

export enum MaintenanceType {
  ROUTINE = 'ROUTINE',
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  EMERGENCY = 'EMERGENCY',
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('maintenance_records')
export class MaintenanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, (asset) => asset.maintenanceRecords, { nullable: true })
  @JoinColumn({ name: 'assetId' })
  asset: Asset;

  @Column({ nullable: true })
  assetId: string;

  @ManyToOne(() => Dock, (dock) => dock.maintenanceRecords, { nullable: true })
  @JoinColumn({ name: 'dockId' })
  dock: Dock;

  @Column({ nullable: true })
  dockId: string;

  @Column({
    type: 'enum',
    enum: MaintenanceType,
  })
  type: MaintenanceType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED,
  })
  status: MaintenanceStatus;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedDate: Date;

  @Column({ nullable: true })
  assignedTo: string; // Staff member name or ID

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCost: number;

  @Column({ type: 'text', nullable: true })
  workPerformed: string;

  @Column({ type: 'text', nullable: true })
  partsReplaced: string;

  @Column({ type: 'simple-array', nullable: true })
  photos: string[]; // Array of file paths

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'int', nullable: true })
  laborHours: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



