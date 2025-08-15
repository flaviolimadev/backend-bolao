import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateEditionDto {
  @ApiProperty() @IsInt() @Min(1) edition_number: number;
  @ApiProperty() @IsDateString() draw_date: string;
  @ApiProperty() @IsInt() @Min(0) individual_card_price: number;
  @ApiProperty() @IsInt() @Min(0) bolao_quota_price: number;
  @ApiProperty() @IsInt() @Min(1) quotas_per_group: number;
  @ApiProperty() @IsInt() @Min(1) cards_per_group: number;
  @ApiProperty() @IsBoolean() is_active: boolean;
  @ApiProperty() @IsString() status: 'draft' | 'active' | 'finalized';
  @ApiProperty() @IsBoolean() sales_paused: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsString() prize_image_url?: string | null;
}



