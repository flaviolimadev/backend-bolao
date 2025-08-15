import { PartialType } from '@nestjs/swagger';
import { CreateRevendedorDto } from './create-revendedor.dto';

export class UpdateRevendedorDto extends PartialType(CreateRevendedorDto) {}



