import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PromotoraService } from './promotora.service';
import { CreatePromotoraDto } from './dto/create-promotora.dto';
import { UpdatePromotoraDto } from './dto/update-promotora.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('promotoras')
@Controller('promotoras')
@UseGuards(JwtAuthGuard)
export class PromotoraController {
  constructor(private readonly service: PromotoraService) {}

  @Get()
  findAll(@Req() req: any) { return this.service.findAll(req.user.sub); }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) { return this.service.findOne(id, req.user.sub); }

  @Post()
  create(@Body() dto: CreatePromotoraDto, @Req() req: any) { return this.service.create(dto, req.user.sub); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePromotoraDto, @Req() req: any) { return this.service.update(id, dto, req.user.sub); }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) { return this.service.remove(id, req.user.sub); }
}



