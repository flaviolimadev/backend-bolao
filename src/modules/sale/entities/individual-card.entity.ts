import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Sale } from './sale.entity';
import { Edition } from '../../edition/entities/edition.entity';

@Entity('individual_cards')
export class IndividualCard {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Index() @Column({ type: 'uuid' }) sale_id: string;
  @ManyToOne(() => Sale, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @Index() @Column({ type: 'uuid' }) edition_id: string;
  @ManyToOne(() => Edition)
  @JoinColumn({ name: 'edition_id' })
  edition: Edition;

  @Column({ type: 'varchar', length: 20, unique: true }) card_number: string;
  @Column({ type: 'boolean', default: false }) card_sent: boolean;
  @Column({ type: 'boolean', default: false }) whatsapp_sent: boolean;
  @Column({ type: 'timestamp', nullable: true }) sent_at?: Date;
  @Column({ type: 'text', nullable: true }) notes?: string;

  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
