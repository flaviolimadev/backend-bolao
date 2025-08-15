import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotora } from './entities/promotora.entity';
import { PromotoraService } from './promotora.service';
import { PromotoraController } from './promotora.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Promotora])],
  controllers: [PromotoraController],
  providers: [PromotoraService],
})
export class PromotoraModule {}



