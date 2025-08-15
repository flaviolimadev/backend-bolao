import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotora } from './entities/promotora.entity';
import { CreatePromotoraDto } from './dto/create-promotora.dto';
import { UpdatePromotoraDto } from './dto/update-promotora.dto';

@Injectable()
export class PromotoraService {
  constructor(@InjectRepository(Promotora) private readonly repo: Repository<Promotora>) {}

  findAll(userId: string) { return this.repo.find({ where: { user_id: userId }, order: { created_at: 'DESC' } }); }
  async findOne(id: string, userId: string) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Promotora não encontrada');
    if (p.user_id !== userId) throw new ForbiddenException();
    return p;
  }
  create(dto: CreatePromotoraDto, userId: string) {
    return this.repo.save(this.repo.create({ ...dto, user_id: userId }));
  }
  async update(id: string, dto: UpdatePromotoraDto, userId: string) {
    const p = await this.findOne(id, userId);
    Object.assign(p, dto);
    return this.repo.save(p);
  }
  async remove(id: string, userId: string) {
    const p = await this.findOne(id, userId);
    await this.repo.remove(p);
    return { deleted: true };
  }
}



