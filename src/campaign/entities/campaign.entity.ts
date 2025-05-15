import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

@Entity({ name: 'campaign' })
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'utm_source', nullable: true, type: 'varchar' })
  utmSource: string | null;

  @Column({ name: 'utm_medium', nullable: true, type: 'varchar' })
  utmMedium: string | null;

  @Column({ name: 'utm_campaign', nullable: true, type: 'varchar' })
  utmCampaign: string | null;

  @Column({ name: 'utm_content', nullable: true, type: 'varchar' })
  utmContent: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
