import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateRevendedorDto {
  @ApiProperty() @IsString() nome: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() contato?: string | null;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() email?: string | null;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() is_active?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsString() photo_url?: string | null;
}



