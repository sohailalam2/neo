import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '../app.controller';
import { AppService } from '../app.service';

import { ArticleDto, ArticlesDto, FileDto } from '../dto';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  describe('getHealth', () => {
    it('should return an object with health status of the application', async () => {
      const res: { [k: string]: string } = await controller.getHealth();

      expect(res.status).toBeDefined();
      expect(res.status).toEqual('healthy');
    });
  });

  describe('getArticles', () => {
    it('should return a list of articles', async () => {
      const res: ArticlesDto = await controller.getArticles();

      expect(res).toBeDefined();
      expect(res.inventory).toBeDefined();
      expect(res.inventory.length).toBeGreaterThan(0);
    });
  });

  describe('getArticleById', () => {
    it('should return an article by it id', async () => {
      const id = '1';
      const res: ArticleDto = await controller.getArticleById(id);

      expect(res).toBeDefined();
      expect(res.art_id).toEqual(id);
    });

    it('should throw a not found exception', async () => {
      const id = '1000';

      try {
        await controller.getArticleById(id);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err.message).toEqual(`No such article found with id ${id}`);
      }
    });
  });

  describe('updateArticles', () => {
    const articles = {
      inventory: [
        { art_id: '1', name: 'leg', stock: '12' },
        { art_id: '2', name: 'screw', stock: '17' },
        { art_id: '3', name: 'seat', stock: '2' },
        { art_id: '4', name: 'table top', stock: '1' },
      ],
    };
    const buffer = Buffer.from(JSON.stringify(articles), 'utf8');

    const params: FileDto = {
      originalname: 'fileName',
      mimetype: 'application/json',
      buffer,
      size: buffer.byteLength,
    };

    it('should return result object upon success', async () => {
      const res: ArticlesDto = await controller.updateArticles(params);

      expect(res).toBeDefined();
      expect(res.inventory).toBeDefined();
      expect(res.inventory.length).toBeGreaterThan(0);
    });
  });
});
