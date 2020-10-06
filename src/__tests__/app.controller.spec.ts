import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '../app.controller';
import { AppService } from '../app.service';

import { InventoryDto, FileDto, ProductDto, ProductsDto } from '../dto';

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

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  let getInventory: jest.SpyInstance;
  let getProducts: jest.SpyInstance;
  let getProductByName: jest.SpyInstance;
  let updateInventory: jest.SpyInstance;
  let updateProducts: jest.SpyInstance;
  let removeProductByName: jest.SpyInstance;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getInventory: jest.fn(),
            getProducts: jest.fn(),
            getProductByName: jest.fn(),
            updateInventory: jest.fn(),
            updateProducts: jest.fn(),
            removeProductByName: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get<AppController>(AppController);
    service = app.get<AppService>(AppService);

    getInventory = jest.spyOn(service, 'getInventory');
    getProducts = jest.spyOn(service, 'getProducts');
    getProductByName = jest.spyOn(service, 'getProductByName');
    updateInventory = jest.spyOn(service, 'updateInventory');
    updateProducts = jest.spyOn(service, 'updateProducts');
    removeProductByName = jest.spyOn(service, 'removeProductByName');
  });

  describe('getHealth', () => {
    it('should return an object with health status of the application', async () => {
      const res: { [k: string]: string } = await controller.getHealth();

      expect(res.status).toBeDefined();
      expect(res.status).toEqual('healthy');
    });
  });

  describe('getInventory', () => {
    it('should return a list of inventory items', async () => {
      getInventory.mockResolvedValueOnce(INVENTORY_ITEMS);

      const res: InventoryDto = await controller.getInventory();

      expect(getInventory).toHaveBeenCalled();
      expect(res).toBeDefined();
      expect(res.inventory).toBeDefined();
      expect(res.inventory.length).toEqual(INVENTORY_ITEMS.length);
      expect(res.inventory[0].art_id).toEqual(INVENTORY_ITEMS[0].art_id);
    });
  });

  describe('updateInventory', () => {
    const inventory = {
      inventory: INVENTORY_ITEMS,
    };
    const buffer = Buffer.from(JSON.stringify(inventory), 'utf8');

    const params: FileDto = {
      originalname: 'fileName',
      mimetype: 'application/json',
      buffer,
      size: buffer.byteLength,
    };

    it('should return result object upon success', async () => {
      updateInventory.mockResolvedValueOnce(inventory.inventory);

      const res: InventoryDto = await controller.updateInventory(params);

      expect(updateInventory).toHaveBeenCalled();
      expect(res).toBeDefined();
      expect(res.inventory).toBeDefined();
      expect(res.inventory.length).toEqual(inventory.inventory.length);
      expect(res.inventory[0].art_id).toEqual(inventory.inventory[0].art_id);
    });
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      getProducts.mockResolvedValueOnce(PRODUCTS);

      const res: ProductsDto = await controller.getProducts();

      expect(getProducts).toHaveBeenCalled();
      expect(res).toBeDefined();
      expect(res.products).toBeDefined();
      expect(res.products.length).toEqual(PRODUCTS.length);
      expect(res.products[0].name).toEqual(PRODUCTS[0].name);
    });
  });

  describe('getProductByName', () => {
    it('should return a product by its name', async () => {
      const product = PRODUCTS[0];

      getProductByName.mockResolvedValueOnce(product);

      const res: ProductDto = await controller.getProductByName(product.name);

      expect(getProductByName).toHaveBeenCalled();
      expect(res).toBeDefined();
      expect(res.name).toEqual(product.name);
    });

    it('should throw a not found exception', async () => {
      const name = 'XXX';

      try {
        await controller.getProductByName(name);
      } catch (err) {
        expect(err).toBeDefined();
        expect(err.message).toEqual(`No such product found with name ${name}`);
      }
    });
  });

  describe('updateProducts', () => {
    const products = {
      products: PRODUCTS,
    };
    const buffer = Buffer.from(JSON.stringify(products), 'utf8');

    const params: FileDto = {
      originalname: 'fileName',
      mimetype: 'application/json',
      buffer,
      size: buffer.byteLength,
    };

    it('should return result object upon success', async () => {
      updateProducts.mockResolvedValueOnce(products.products);

      const res: ProductsDto = await controller.updateProducts(params);

      expect(updateProducts).toHaveBeenCalled();
      expect(res).toBeDefined();
      expect(res.products).toBeDefined();
      expect(res.products.length).toEqual(products.products.length);
      expect(res.products[0].name).toEqual(products.products[0].name);
    });
  });

  describe('removeProductByName', () => {
    it('should delete the product', async () => {
      removeProductByName.mockResolvedValueOnce(null);
      const product = PRODUCTS[0];

      const res: void = await controller.removeProductByName(product.name);

      expect(removeProductByName).toHaveBeenCalled();
      expect(res).not.toBeDefined();
    });
  });
});
