import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getArticles', () => {
    it('should return a list of articles', async () => {
      const items = await service.getArticles();

      expect(items).toBeDefined();
      expect(items.length).toBeGreaterThan(0);
    });
  });

  describe('getArticleById', () => {
    it('should return an article', async () => {
      const id = '1';
      const item = await service.getArticleById(id);

      expect(item).toBeDefined();
      expect(item.art_id).toEqual(id);
    });

    it('should return undefined if no such item is found', async () => {
      const id = '1000';
      const item = await service.getArticleById(id);

      expect(item).not.toBeDefined();
    });
  });

  describe('updateArticles', () => {
    it('should upload articles and return a list of articles', async () => {
      const articles = [
        { art_id: '1', name: 'leg', stock: '12' },
        { art_id: '2', name: 'screw', stock: '17' },
        { art_id: '3', name: 'seat', stock: '2' },
        { art_id: '4', name: 'table top', stock: '1' },
      ];

      const items = await service.updateArticles(articles);

      expect(items).toBeDefined();
      expect(items.length).toEqual(articles.length);
      expect(items[0].art_id).toEqual(articles[0].art_id);
    });
  });
});
