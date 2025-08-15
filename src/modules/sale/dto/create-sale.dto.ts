import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSaleDto {
  // cliente existente ou dados de novo cliente
  @ApiProperty({ required: false }) @IsOptional() @IsString() customer_id?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() customer_nome?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() customer_contato?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() customer_cpf?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() customer_email?: string;

  @ApiProperty() @IsString() edition_id: string;
  @ApiProperty({ enum: ['individual_card', 'bolao_quota'] as const }) @IsEnum(['individual_card','bolao_quota']) sale_type: 'individual_card' | 'bolao_quota';
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(1) quotas_quantity?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() promotora_id?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() revendedor_id?: string;
  @ApiProperty({ enum: ['direct','promotora','revendedor'] as const }) @IsEnum(['direct','promotora','revendedor']) sale_origin: 'direct' | 'promotora' | 'revendedor';
}



