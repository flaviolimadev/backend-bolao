import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(@InjectRepository(Cliente) private readonly repo: Repository<Cliente>) {}

  findAll(userId: string) { return this.repo.find({ where: { user_id: userId }, order: { created_at: 'DESC' } }); }
  async findOne(id: string, userId: string) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Cliente não encontrado');
    if (c.user_id !== userId) throw new ForbiddenException();
    return c;
  }
  create(dto: CreateClienteDto, userId: string) {
    return this.repo.save(this.repo.create({ ...dto, user_id: userId }));
  }
  async update(id: string, dto: UpdateClienteDto, userId: string) {
    const c = await this.findOne(id, userId);
    Object.assign(c, dto);
    return this.repo.save(c);
  }
  async remove(id: string, userId: string) {
    const c = await this.findOne(id, userId);
    await this.repo.remove(c);
    return { deleted: true };
  }
}



