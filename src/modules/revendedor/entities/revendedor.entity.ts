import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('revendedores')
export class Revendedor {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index() @Column({ type: 'uuid' }) user_id: string;

  @Column({ type: 'text' }) nome: string;
  @Column({ type: 'text', nullable: true }) contato?: string | null;
  @Column({ type: 'text', nullable: true }) email?: string | null;
  @Column({ type: 'boolean', default: true }) is_active: boolean;
  @Column({ type: 'text', nullable: true }) photo_url?: string | null;

  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}



