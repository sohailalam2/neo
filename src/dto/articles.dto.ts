import { Article } from '../interfaces';

export class ArticleDto implements Article {
  art_id: string;

  name: string;

  stock: string;
}

export class ArticlesDto {
  inventory?: Article[];
}
