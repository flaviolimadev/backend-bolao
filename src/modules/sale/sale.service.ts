import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Edition } from '../edition/entities/edition.entity';
import { IndividualCardService } from './individual-card.service';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale) private readonly repo: Repository<Sale>,
    @InjectRepository(Cliente) private readonly clientes: Repository<Cliente>,
    @InjectRepository(Edition) private readonly editions: Repository<Edition>,
    private readonly individualCardService: IndividualCardService,
  ) {}

  async findAll(userId: string, editionId?: string) {
    const where: any = { user_id: userId };
    if (editionId) where.edition_id = editionId;
    return this.repo.find({
      where,
      order: { created_at: 'DESC' },
      relations: ['customer', 'edition', 'promotora', 'revendedor'],
    });
  }

  async findOne(id: string, userId: string) {
    const s = await this.repo.findOne({ where: { id }, relations: ['customer', 'edition', 'promotora', 'revendedor'] });
    if (!s) throw new NotFoundException('Venda não encontrada');
    if (s.user_id !== userId) throw new ForbiddenException();
    return s;
  }

  async create(dto: CreateSaleDto, userId: string) {
    // validar edição ativa
    const edition = await this.editions.findOne({ where: { id: dto.edition_id } });
    if (!edition) throw new BadRequestException('Edição inválida');

    let customerId = dto.customer_id;
    if (!customerId) {
      if (!dto.customer_nome) throw new BadRequestException('Dados do cliente ausentes');
      const c = await this.clientes.save(this.clientes.create({
        user_id: userId,
        nome: dto.customer_nome,
        contato: dto.customer_contato ?? null,
        cpf: dto.customer_cpf ?? null,
        email: dto.customer_email ?? null,
        is_active: true,
      }));
      customerId = c.id;
    }

    const amount = dto.sale_type === 'individual_card'
      ? (edition as any).individual_card_price
      : (edition as any).bolao_quota_price * (dto.quotas_quantity ?? 1);

    const sale = this.repo.create({
      user_id: userId,
      customer_id: customerId!,
      edition_id: dto.edition_id,
      sale_type: dto.sale_type,
      amount,
      quotas_quantity: dto.sale_type === 'bolao_quota' ? (dto.quotas_quantity ?? 1) : null,
      promotora_id: dto.promotora_id ?? null,
      revendedor_id: dto.revendedor_id ?? null,
      sale_origin: dto.sale_origin ?? 'direct',
      payment_status: 'pending',
    });

    const savedSale = await this.repo.save(sale);

    // Se for venda de cartela individual, criar automaticamente a cartela
    if (dto.sale_type === 'individual_card') {
      try {
        await this.individualCardService.createForSale(savedSale.id, dto.edition_id);
      } catch (error) {
        console.error('Erro ao criar cartela individual:', error);
        // Não falhar a venda se a cartela não puder ser criada
      }
    }

    return savedSale;
  }

  async update(id: string, dto: UpdateSaleDto, userId: string) {
    const sale = await this.findOne(id, userId);
    Object.assign(sale, dto);
    return this.repo.save(sale);
  }

  async remove(id: string, userId: string) {
    const sale = await this.findOne(id, userId);
    await this.repo.remove(sale);
    return { deleted: true };
  }
}


