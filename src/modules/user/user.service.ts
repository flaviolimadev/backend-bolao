import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  private async hashPassword(raw: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(raw, salt);
  }

  async create(dto: CreateUserDto) {
    // aplica hash
    const hashed = await this.hashPassword(dto.password);
    const entity = this.repo.create({
      ...dto,
      password: hashed,
      status: 0,
      deleted: false,
      avatar: null,
    });

    try {
      const saved = await this.repo.save(entity);

      const verifiedTrue = this.config.get<boolean>('VERIFIED_EMAIL') || this.config.get<boolean>('VERIFIED-EMAIL');
      if (verifiedTrue) {
        const code = (randomBytes(3).toString('hex')).toUpperCase(); // 6 hex chars
        const hash = await bcrypt.hash(code, 10);
        const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 min

        await this.repo.update(saved.id, {
          verification_code_hash: hash,
          verification_expires_at: expires,
        });

        const appUrl = this.config.get<string>('APP_PUBLIC_URL');
        await this.mail.sendTemplate({
          to: saved.email,
          subject: 'Confirme seu e-mail',
          template: 'account-verification',
          variables: {
            app_name: 'Base Backend',
            year: new Date().getFullYear(),
            verification_url: `${appUrl}/verify?user=${saved.id}`,
            name: saved.nome || saved.email,
            code,
          },
        });
      }

      return saved;
    } catch (e: any) {
      // erro de violação de unique (email/contato)
      if (e.code === '23505') {
        throw new ConflictException('Email ou contato já está em uso');
      }
      throw e;
    }
  }

  async findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findOne(id);

    // re-hash se senha foi enviada
    let password = user.password;
    const passwordChanged = !!dto.password;
    if (dto.password) {
      password = await this.hashPassword(dto.password);
    }

    Object.assign(user, { ...dto, password });

    try {
      const saved = await this.repo.save(user);
      // Notificar por e-mail quando a senha for alterada
      if (passwordChanged) {
        const appUrl = this.config.get<string>('APP_PUBLIC_URL');
        await this.mail.sendTemplate({
          to: saved.email,
          subject: 'Sua senha foi alterada',
          template: 'password-changed',
          variables: {
            app_name: 'Base Backend',
            year: new Date().getFullYear(),
            name: saved.nome || saved.email,
            changed_at: new Date().toISOString(),
            security_url: `${appUrl}/reset-password`,
            ip_address: '0.0.0.0',
          },
        });
      }
      return saved;
    } catch (e: any) {
      if (e.code === '23505') {
        throw new ConflictException('Email ou contato já está em uso');
      }
      throw e;
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.repo.remove(user);
    return { deleted: true };
  }

  async verifyEmail(userId: string, code: string) {
    const user = await this.repo.findOne({
      where: { id: userId },
      select: ['id', 'email', 'nome', 'email_verified', 'verification_code_hash', 'verification_expires_at'],
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.email_verified) return { verified: true };
    if (!user.verification_code_hash || !user.verification_expires_at) throw new BadRequestException('Código inválido');
    if (user.verification_expires_at.getTime() < Date.now()) throw new BadRequestException('Código expirado');

    const ok = await bcrypt.compare(code, user.verification_code_hash);
    if (!ok) throw new BadRequestException('Código inválido');

    await this.repo.update(userId, {
      email_verified: true,
      verification_code_hash: null,
      verification_expires_at: null,
    });

    // Envia email de boas-vindas
    const appUrl = this.config.get<string>('APP_PUBLIC_URL');
    await this.mail.sendTemplate({
      to: user.email,
      subject: 'Bem-vindo(a)!',
      template: 'welcome',
      variables: {
        app_name: 'Base Backend',
        year: new Date().getFullYear(),
        name: user.nome || user.email,
        action_url: `${appUrl}/dashboard`,
        cta_label: 'Acessar painel',
      },
    });

    return { verified: true };
  }
}
