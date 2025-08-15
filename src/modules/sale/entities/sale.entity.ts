import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Edition } from '../../edition/entities/edition.entity';
import { Promotora } from '../../promotora/entities/promotora.entity';
import { Revendedor } from '../../revendedor/entities/revendedor.entity';

export type SaleType = 'individual_card' | 'bolao_quota';
export type PaymentStatus = 'pending' | 'paid' | 'canceled' | 'refunded';
export type SaleOrigin = 'direct' | 'promotora' | 'revendedor';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Index() @Column({ type: 'uuid' }) user_id: string;

  @Column({ type: 'uuid' }) customer_id: string;
  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'customer_id' })
  customer: Cliente;

  @Column({ type: 'uuid' }) edition_id: string;
  @ManyToOne(() => Edition)
  @JoinColumn({ name: 'edition_id' })
  edition: Edition;

  @Column({ type: 'uuid', nullable: true }) promotora_id?: string | null;
  @ManyToOne(() => Promotora)
  @JoinColumn({ name: 'promotora_id' })
  promotora?: Promotora | null;

  @Column({ type: 'uuid', nullable: true }) revendedor_id?: string | null;
  @ManyToOne(() => Revendedor)
  @JoinColumn({ name: 'revendedor_id' })
  revendedor?: Revendedor | null;

  @Column({ type: 'varchar', length: 20 }) sale_type: SaleType;
  @Column({ type: 'int' }) amount: number; // cents
  @Column({ type: 'int', nullable: true }) quotas_quantity?: number | null;
  @Column({ type: 'varchar', length: 20, default: 'pending' }) payment_status: PaymentStatus;
  @Column({ type: 'varchar', length: 20, default: 'direct' }) sale_origin: SaleOrigin;

  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}



