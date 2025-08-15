import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EditionService } from './edition.service';
import { CreateEditionDto } from './dto/create-edition.dto';
import { UpdateEditionDto } from './dto/update-edition.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('editions')
@Controller('editions')
export class EditionController {
  constructor(private readonly service: EditionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any) { return this.service.findAllByUser(req.user.sub); }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req: any) { return this.service.findOne(id, req.user.sub); }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateEditionDto, @Req() req: any) { return this.service.create(dto, req.user.sub); }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateEditionDto, @Req() req: any) { return this.service.update(id, dto, req.user.sub); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: any) { return this.service.remove(id, req.user.sub); }
}


