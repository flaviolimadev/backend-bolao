import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndividualCard } from './entities/individual-card.entity';
import { Sale } from './entities/sale.entity';
import { Edition } from '../edition/entities/edition.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class IndividualCardService {
  constructor(
    @InjectRepository(IndividualCard) private readonly repo: Repository<IndividualCard>,
    @InjectRepository(Sale) private readonly salesRepo: Repository<Sale>,
    @InjectRepository(Edition) private readonly editionsRepo: Repository<Edition>,
    private readonly mailService: MailService,
  ) {}

  async createForSale(saleId: string, editionId: string): Promise<IndividualCard> {
    // Buscar a venda e edição para gerar o número da cartela
    const sale = await this.salesRepo.findOne({ where: { id: saleId } });
    if (!sale) throw new NotFoundException('Venda não encontrada');

    const edition = await this.editionsRepo.findOne({ where: { id: editionId } });
    if (!edition) throw new NotFoundException('Edição não encontrada');

    // Gerar número único da cartela: ED{edition_number}{4 primeiros chars do sale_id}
    let cardNumber = `${String(edition.edition_number).padStart(2, '0')}${saleId.substring(0, 4).toUpperCase()}`;

    // Verificar se já existe uma cartela com este número
    const existingCard = await this.repo.findOne({ where: { card_number: cardNumber } });
    if (existingCard) {
      // Se já existe, gerar um número único adicionando um sufixo
      let suffix = 1;
      let newCardNumber = cardNumber;
      while (await this.repo.findOne({ where: { card_number: newCardNumber } })) {
        newCardNumber = `${cardNumber}${String(suffix).padStart(2, '0')}`;
        suffix++;
      }
      cardNumber = newCardNumber;
    }

    const individualCard = this.repo.create({
      sale_id: saleId,
      edition_id: editionId,
      card_number: cardNumber,
      card_sent: false,
      whatsapp_sent: false,
    });

    return this.repo.save(individualCard);
  }

  async findAll(userId: string, editionId?: string) {
    const query = this.repo
      .createQueryBuilder('card')
      .leftJoinAndSelect('card.sale', 'sale')
      .leftJoinAndSelect('sale.customer', 'customer')
      .leftJoinAndSelect('sale.edition', 'edition')
      .leftJoinAndSelect('sale.promotora', 'promotora')
      .leftJoinAndSelect('sale.revendedor', 'revendedor')
      .where('sale.user_id = :userId', { userId });

    if (editionId) {
      query.andWhere('card.edition_id = :editionId', { editionId });
    }

    return query
      .orderBy('card.created_at', 'DESC')
      .getMany();
  }

  async findOne(id: string, userId: string) {
    const card = await this.repo.findOne({
      where: { id },
      relations: ['sale', 'sale.customer', 'sale.edition', 'sale.promotora', 'sale.revendedor'],
    });

    if (!card) throw new NotFoundException('Cartela não encontrada');
    if (card.sale.user_id !== userId) throw new NotFoundException('Acesso negado');

    return card;
  }

  async markAsSent(id: string, userId: string, type: 'card' | 'whatsapp') {
    const card = await this.findOne(id, userId);
    
    if (type === 'card') {
      card.card_sent = true;
      card.sent_at = new Date();
    } else if (type === 'whatsapp') {
      card.whatsapp_sent = true;
    }

    return this.repo.save(card);
  }

  async updateNotes(id: string, userId: string, notes: string) {
    const card = await this.findOne(id, userId);
    card.notes = notes;
    return this.repo.save(card);
  }

  async sendFile(id: string, userId: string, file: any, notes?: string) {
    console.log('🔍 Iniciando sendFile...', { id, userId, notes });
    
    try {
      const card = await this.findOne(id, userId);
      console.log('✅ Cartela encontrada:', card.card_number);
      
      // TODO: Implementar upload para R2
      // Por enquanto, vamos apenas marcar como enviada e salvar as notas
      
      card.card_sent = true;
      card.sent_at = new Date();
      if (notes) {
        card.notes = notes;
      }
      
      console.log('📝 Cartela atualizada:', { 
        card_sent: card.card_sent, 
        sent_at: card.sent_at, 
        notes: card.notes 
      });
      
      // Enviar email para o cliente
      try {
        console.log('📧 Enviando email...');
        await this.sendEmailToCustomer(card, file, notes);
        console.log('✅ Email enviado com sucesso');
      } catch (error) {
        console.error('❌ Erro ao enviar email:', error);
        // Não falhar se o email não puder ser enviado
      }
      
      console.log('💾 Salvando cartela no banco...');
      const savedCard = await this.repo.save(card);
      console.log('✅ Cartela salva com sucesso:', savedCard.id);
      
      return savedCard;
    } catch (error) {
      console.error('❌ Erro em sendFile:', error);
      throw error;
    }
  }

  private async sendEmailToCustomer(card: IndividualCard, file: any, notes?: string) {
    console.log('📧 Iniciando sendEmailToCustomer...');
    console.log('📁 Arquivo recebido:', file ? {
      name: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      hasBuffer: !!file.buffer,
      bufferLength: file.buffer ? file.buffer.length : 0
    } : 'Nenhum arquivo');
    
    const customer = card.sale.customer;
    const edition = card.sale.edition;
    
    if (!customer.email) {
      throw new Error('Cliente não possui email cadastrado');
    }

    const variables = {
      customer_name: customer.nome,
      customer_cpf: customer.cpf || 'Não informado',
      customer_contact: customer.contato || 'Não informado',
      card_number: card.card_number,
      edition_number: edition.edition_number,
      created_date: new Date(card.created_at).toLocaleDateString('pt-BR'),
      notes: notes || '',
      year: new Date().getFullYear(),
    };

    const attachments = file ? [{
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype,
    }] : undefined;

    console.log('📎 Anexos preparados:', attachments);

    await this.mailService.sendTemplate({
      to: customer.email,
      subject: `Sua Cartela Individual #${card.card_number} está pronta!`,
      template: 'individual-card',
      variables,
      attachments,
    });
    
    console.log('✅ Email enviado com anexos');
  }

  async delete(id: string, userId: string) {
    const card = await this.findOne(id, userId);
    await this.repo.remove(card);
    return { deleted: true };
  }
}
