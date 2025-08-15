import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('sales')
@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SaleController {
  constructor(private readonly service: SaleService) {}

  @Get()
  findAll(@Req() req: any, @Query('edition') edition?: string) { return this.service.findAll(req.user.sub, edition); }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) { return this.service.findOne(id, req.user.sub); }

  @Post()
  create(@Body() dto: CreateSaleDto, @Req() req: any) { return this.service.create(dto, req.user.sub); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSaleDto, @Req() req: any) { return this.service.update(id, dto, req.user.sub); }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) { return this.service.remove(id, req.user.sub); }
}



