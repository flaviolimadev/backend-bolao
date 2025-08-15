import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edition } from './entities/edition.entity';
import { EditionService } from './edition.service';
import { EditionController } from './edition.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Edition])],
  controllers: [EditionController],
  providers: [EditionService],
})
export class EditionModule {}



