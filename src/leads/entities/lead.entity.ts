import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'mautic_id', unique: true, nullable: true })
  mauticId: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  phone: string | null;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ name: 'last_updated', nullable: true })
  lastUpdated: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
