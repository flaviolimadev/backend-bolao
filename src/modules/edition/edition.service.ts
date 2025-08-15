import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Edition } from './entities/edition.entity';
import { CreateEditionDto } from './dto/create-edition.dto';
import { UpdateEditionDto } from './dto/update-edition.dto';

@Injectable()
export class EditionService {
  constructor(@InjectRepository(Edition) private readonly repo: Repository<Edition>) {}

  findAllByUser(userId: string) { return this.repo.find({ where: { user_id: userId }, order: { edition_number: 'DESC' } }); }
  async findOne(id: string, userId?: string) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Edition not found');
    if (userId && e.user_id !== userId) throw new ForbiddenException();
    return e;
  }
  async create(dto: CreateEditionDto, userId: string) {
    try {
      const e = this.repo.create({
        ...dto,
        user_id: userId,
        draw_date: new Date(dto.draw_date),
      });
      return await this.repo.save(e);
    } catch (e: any) {
      if (e.code === '23505') throw new ConflictException('edition_number já existe');
      throw e;
    }
  }
  async update(id: string, dto: UpdateEditionDto, userId: string) {
    const current = await this.findOne(id, userId);
    Object.assign(current, { ...dto, draw_date: dto.draw_date ? new Date(dto.draw_date) : current.draw_date });
    return this.repo.save(current);
  }
  async remove(id: string, userId: string) {
    const current = await this.findOne(id, userId);
    await this.repo.remove(current);
    return { deleted: true };
  }
}


