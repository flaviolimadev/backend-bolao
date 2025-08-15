import { PartialType } from '@nestjs/swagger';
import { CreatePromotoraDto } from './create-promotora.dto';

export class UpdatePromotoraDto extends PartialType(CreatePromotoraDto) {}



