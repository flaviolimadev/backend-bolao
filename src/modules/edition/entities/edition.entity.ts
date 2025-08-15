import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export type EditionStatus = 'draft' | 'active' | 'finalized';

@Entity('editions')
export class Edition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Dono (escopo por usuário)
  @Index()
  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Index({ unique: true })
  @Column({ type: 'int' })
  edition_number: number;

  @Column({ type: 'timestamp' })
  draw_date: Date;

  @Column({ type: 'int' })
  individual_card_price: number; // cents

  @Column({ type: 'int' })
  bolao_quota_price: number; // cents

  @Column({ type: 'int' })
  quotas_per_group: number;

  @Column({ type: 'int' })
  cards_per_group: number;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: EditionStatus;

  @Column({ type: 'boolean', default: false })
  sales_paused: boolean;

  @Column({ type: 'text', nullable: true })
  prize_image_url?: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


