import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('clientes')
@Controller('clientes')
@UseGuards(JwtAuthGuard)
export class ClienteController {
  constructor(private readonly service: ClienteService) {}

  @Get()
  findAll(@Req() req: any) { return this.service.findAll(req.user.sub); }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) { return this.service.findOne(id, req.user.sub); }

  @Post()
  create(@Body() dto: CreateClienteDto, @Req() req: any) { return this.service.create(dto, req.user.sub); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClienteDto, @Req() req: any) { return this.service.update(id, dto, req.user.sub); }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) { return this.service.remove(id, req.user.sub); }
}



