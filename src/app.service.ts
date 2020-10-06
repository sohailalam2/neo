import { Injectable } from '@nestjs/common';

import { Article } from './interfaces';

const articles = {
  inventory: [
    {
      art_id: '1',
      name: 'leg',
      stock: '12',
    },
    {
      art_id: '2',
      name: 'screw',
      stock: '17',
    },
    {
      art_id: '3',
      name: 'seat',
      stock: '2',
    },
    {
      art_id: '4',
      name: 'table top',
      stock: '1',
    },
  ],
};

@Injectable()
export class AppService {
  async getArticles(): Promise<Article[]> {
    return articles.inventory;
  }

  async getArticleById(id: string): Promise<Article> {
    return articles.inventory.find(i => i.art_id === id);
  }

  async updateArticles(articles: Article[]) {
    return articles;
  }
}
