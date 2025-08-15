import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Revendedor } from './entities/revendedor.entity';
import { CreateRevendedorDto } from './dto/create-revendedor.dto';
import { UpdateRevendedorDto } from './dto/update-revendedor.dto';

@Injectable()
export class RevendedorService {
  constructor(@InjectRepository(Revendedor) private readonly repo: Repository<Revendedor>) {}

  findAll(userId: string) { return this.repo.find({ where: { user_id: userId }, order: { created_at: 'DESC' } }); }
  async findOne(id: string, userId: string) {
    const r = await this.repo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Revendedor não encontrado');
    if (r.user_id !== userId) throw new ForbiddenException();
    return r;
  }
  create(dto: CreateRevendedorDto, userId: string) {
    return this.repo.save(this.repo.create({ ...dto, user_id: userId }));
  }
  async update(id: string, dto: UpdateRevendedorDto, userId: string) {
    const r = await this.findOne(id, userId);
    Object.assign(r, dto);
    return this.repo.save(r);
  }
  async remove(id: string, userId: string) {
    const r = await this.findOne(id, userId);
    await this.repo.remove(r);
    return { deleted: true };
  }
}



