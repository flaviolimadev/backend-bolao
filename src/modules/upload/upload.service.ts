import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { Readable } from 'stream';

@Injectable()
export class UploadService {
  private s3: S3Client;
  private bucket: string;
  private publicBase: string;
  private accountId: string;
  private appUrl: string;

  constructor(private readonly config: ConfigService) {
    this.accountId = this.config.getOrThrow<string>('CLOUDFLARE_ACCOUNT_ID');
    const accessKeyId = this.config.getOrThrow<string>('CLOUDFLARE_ACCESS_KEY_ID');
    const secretAccessKey = this.config.getOrThrow<string>('CLOUDFLARE_SECRET_ACCESS_KEY');
    this.bucket = this.config.getOrThrow<string>('CLOUDFLARE_R2_BUCKET_NAME');
    const endpoint = `https://${this.accountId}.r2.cloudflarestorage.com`;
    // URL pública via backend (proxy), evita CORS e dependência de bucket público
    this.appUrl = this.config.getOrThrow<string>('APP_PUBLIC_URL');
    this.publicBase = `${this.appUrl.replace(/\/$/, '')}/upload/file?key=`;

    this.s3 = new S3Client({
      region: 'auto',
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async createPresignedUpload(key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(this.s3, command, { expiresIn: 600 }); // 10 min
    return {
      uploadUrl,
      publicUrl: `${this.publicBase}${encodeURIComponent(key)}`,
      expiresAt: Math.floor(Date.now() / 1000) + 600,
    };
  }

  async uploadBuffer(key: string, contentType: string, buffer: Buffer) {
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }));
    return {
      publicUrl: `${this.publicBase}${encodeURIComponent(key)}`,
    };
  }

  async getObject(key: string): Promise<{ body: Readable; contentType: string; contentLength?: number }> {
    const out: any = await this.s3.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
    return {
      body: out.Body as Readable,
      contentType: out.ContentType || 'application/octet-stream',
      contentLength: out.ContentLength,
    };
  }
}


