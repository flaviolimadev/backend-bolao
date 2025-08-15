import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { IndividualCard } from './entities/individual-card.entity';
import { IndividualCardService } from './individual-card.service';
import { IndividualCardController } from './individual-card.controller';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Edition } from '../edition/entities/edition.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, IndividualCard, Cliente, Edition]), MailModule],
  controllers: [SaleController, IndividualCardController],
  providers: [SaleService, IndividualCardService],
  exports: [SaleService, IndividualCardService],
})
export class SaleModule {}


