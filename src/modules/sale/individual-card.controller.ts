import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { IndividualCardService } from './individual-card.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('individual-cards')
@UseGuards(JwtAuthGuard)
export class IndividualCardController {
  constructor(private readonly individualCardService: IndividualCardService) {}

  @Get()
  async findAll(@Request() req, @Query('edition') editionId?: string) {
    return this.individualCardService.findAll(req.user.sub, editionId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.individualCardService.findOne(id, req.user.sub);
  }

  @Patch(':id/mark-sent')
  async markAsSent(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { type: 'card' | 'whatsapp' }
  ) {
    return this.individualCardService.markAsSent(id, req.user.sub, body.type);
  }

  @Patch(':id/notes')
  async updateNotes(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { notes: string }
  ) {
    return this.individualCardService.updateNotes(id, req.user.sub, body.notes);
  }

  @Patch(':id/send-file')
  @UseInterceptors(AnyFilesInterceptor())
  async sendFile(
    @Request() req,
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() files: any[]
  ) {
    console.log('🔍 Controller sendFile chamado:', { 
      id, 
      userId: req.user?.sub, 
      user: req.user,
      body, 
      filesCount: files ? files.length : 0
    });
    
    // Log adicional para debug dos arquivos
    console.log('📁 Arquivos recebidos:', files);
    console.log('📁 Tipo dos arquivos:', typeof files);
    console.log('📁 Quantidade de arquivos:', files ? files.length : 0);
    
    // Pegar o primeiro arquivo (que deve ser o arquivo da cartela)
    const file = files && files.length > 0 ? files[0] : null;
    console.log('📁 Arquivo selecionado:', file);
    
    if (!req.user?.sub) {
      console.error('❌ req.user.sub não encontrado:', req.user);
      throw new Error('Usuário não autenticado');
    }
    
    try {
      const result = await this.individualCardService.sendFile(id, req.user.sub, file, body.notes);
      console.log('✅ Controller sendFile concluído:', result.id);
      return result;
    } catch (error) {
      console.error('❌ Erro no controller sendFile:', error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.individualCardService.delete(id, req.user.sub);
  }
}
