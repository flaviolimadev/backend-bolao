import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Revendedor } from './entities/revendedor.entity';
import { RevendedorService } from './revendedor.service';
import { RevendedorController } from './revendedor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Revendedor])],
  controllers: [RevendedorController],
  providers: [RevendedorService],
})
export class RevendedorModule {}



