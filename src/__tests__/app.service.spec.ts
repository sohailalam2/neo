import { Test, TestingModule } from '@nestjs/testing';
import { Product } from 'src/interfaces';

import { AppService } from '../app.service';
import { DbService } from '../db/db.service';

const INVENTORY_ITEMS = [
  { art_id: '1', name: 'leg', stock: 12 },
  { art_id: '2', name: 'screw', stock: 17 },
  { art_id: '3', name: 'seat', stock: 2 },
  { art_id: '4', name: 'table top', stock: 1 },
];

const PRODUCTS = [
  {
    name: 'Dining Chair',
    contain_articles: [
      {
        art_id: '1',
        amount_of: 4,
      },
      {
        art_id: '2',
        amount_of: 8,
      },
      {
        art_id: '3',
        amount_of: 1,
      },
    ],
  },
  {
    name: 'Dinning Table',
    contain_articles: [
      {
        art_id: '1',
        amount_of: 4,
      },
      {
        art_id: '2',
        amount_of: 8,
      },
      {
        art_id: '4',
        amount_of: 1,
      },
    ],
  },
];

describe('AppService', () => {
  let service: AppService;
  let db: DbService;

  let spyInsert: jest.SpyInstance;
  let spyFind: jest.SpyInstance;
  let spyRemove: jest.SpyInstance;
  let spyFilterAndUpdate: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: DbService,
          useValue: {
            insert: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
            filterAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    db = module.get<DbService>(DbService);

    spyInsert = jest.spyOn(db, 'insert');
    spyFind = jest.spyOn(db, 'find');
    spyRemove = jest.spyOn(db, 'remove');
    spyFilterAndUpdate = jest.spyOn(db, 'filterAndUpdate');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getInventory', () => {
    it('should return a list of articles', async () => {
      spyFind.mockResolvedValueOnce(INVENTORY_ITEMS);

      const items = await service.getInventory();

      expect(spyFind).toHaveBeenCalled();
      expect(items).toBeDefined();
      expect(items.length).toEqual(INVENTORY_ITEMS.length);
    });
  });

  describe('updateInventory', () => {
    it('should upload articles and return a list of articles', async () => {
      spyInsert.mockResolvedValueOnce(INVENTORY_ITEMS);
      const items = await service.updateInventory(INVENTORY_ITEMS);

      expect(spyInsert).toHaveBeenCalled();
      expect(items).toBeDefined();
      expect(items.length).toEqual(INVENTORY_ITEMS.length);
      expect(items[0].art_id).toEqual(INVENTORY_ITEMS[0].art_id);
    });
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      spyFind.mockResolvedValueOnce(PRODUCTS);

      const items = await service.getProducts();

      expect(spyFind).toHaveBeenCalled();
      expect(items).toBeDefined();
      expect(items.length).toEqual(PRODUCTS.length);
    });
  });

  describe('getProductByName', () => {
    it('should return a product by its name', async () => {
      const product = PRODUCTS[0];

      spyFind.mockResolvedValueOnce(product);

      const res: Product = await service.getProductByName(product.name);

      expect(spyFind).toHaveBeenCalled();
      expect(res).toBeDefined();
      expect(res.name).toEqual(product.name);
    });

    it('should throw a not found exception', async () => {
      const name = 'XXX';
      const res: Product = await service.getProductByName(name);

      expect(res).not.toBeDefined();
    });
  });

  describe('updateProducts', () => {
    it('should upload products and return a list of products', async () => {
      spyInsert.mockResolvedValueOnce(PRODUCTS);
      const items = await service.updateProducts(PRODUCTS);

      expect(spyInsert).toHaveBeenCalled();
      expect(items).toBeDefined();
      expect(items.length).toEqual(PRODUCTS.length);
      expect(items[0].name).toEqual(PRODUCTS[0].name);
    });
  });

  describe('removeProductByName', () => {
    it('should remove the product and decrement the inventory item stock', async () => {
      const product = PRODUCTS[0];
      spyFind.mockResolvedValueOnce(product);

      const items = await service.removeProductByName(product.name);

      expect(spyFind).toHaveBeenCalledWith('name', product.name);
      expect(spyFilterAndUpdate).toHaveBeenCalled();
      expect(spyRemove).toHaveBeenCalledWith('name', product.name);

      expect(items).not.toBeDefined();
    });
  });
});
