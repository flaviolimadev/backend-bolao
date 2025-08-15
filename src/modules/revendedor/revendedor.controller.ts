import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RevendedorService } from './revendedor.service';
import { CreateRevendedorDto } from './dto/create-revendedor.dto';
import { UpdateRevendedorDto } from './dto/update-revendedor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('revendedores')
@Controller('revendedores')
@UseGuards(JwtAuthGuard)
export class RevendedorController {
  constructor(private readonly service: RevendedorService) {}

  @Get()
  findAll(@Req() req: any) { return this.service.findAll(req.user.sub); }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) { return this.service.findOne(id, req.user.sub); }

  @Post()
  create(@Body() dto: CreateRevendedorDto, @Req() req: any) { return this.service.create(dto, req.user.sub); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRevendedorDto, @Req() req: any) { return this.service.update(id, dto, req.user.sub); }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) { return this.service.remove(id, req.user.sub); }
}



