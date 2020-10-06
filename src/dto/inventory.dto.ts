import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { InventoryItem } from '../interfaces';

export class InventoryItemDto implements InventoryItem {
  @IsString()
  @IsNotEmpty()
  art_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  stock: number;
}

export class InventoryDto {
  @IsNotEmpty()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => InventoryItemDto)
  inventory: InventoryItemDto[];
}
