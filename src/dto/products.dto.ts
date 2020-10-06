import {
  IsString,
  IsNotEmpty,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Product, ProductArticle } from '../interfaces';

export class ProductDto implements Product {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  contain_articles: ProductArticle[];
}

export class ProductsDto {
  @IsNotEmpty()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
