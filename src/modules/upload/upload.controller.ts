import { Body, Controller, Get, Header, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly service: UploadService) {}

  @Post('presign')
  @UseGuards(JwtAuthGuard)
  async presign(@Body() body: { key: string; contentType: string }, @Req() req: any) {
    const pre = await this.service.createPresignedUpload(body.key, body.contentType);
    const base = `${req.protocol}://${req.get('host')}`;
    return { ...pre, publicUrl: `${base}/upload/file?key=${encodeURIComponent(body.key)}` };
  }

  // alternativa com proxy: upload multipart para o backend e o backend envia à R2
  @Post('direct')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async direct(
    @UploadedFile() file: any,
    @Body() body: { key: string },
    @Req() req: any,
  ) {
    const { key } = body;
    await this.service.uploadBuffer(key, file.mimetype, file.buffer);
    const base = `${req.protocol}://${req.get('host')}`;
    return { publicUrl: `${base}/upload/file?key=${encodeURIComponent(key)}` };
  }

  // Proxy GET público para servir arquivos sem CORS
  @Get('file')
  async file(@Query('key') key: string, @Res() res: Response) {
    try {
      const obj = await this.service.getObject(key);
      res.setHeader('Content-Type', obj.contentType);
      if (obj.contentLength) res.setHeader('Content-Length', String(obj.contentLength));
      return obj.body.pipe(res);
    } catch (e: any) {
      res.status(404).send('Not found');
    }
  }
}


