import { Injectable } from '@nestjs/common';
import { DbService } from './db/db.service';

import { InventoryItem, Product } from './interfaces';

@Injectable()
export class AppService {
  constructor(private readonly db: DbService) {}

  async getInventory(): Promise<InventoryItem[]> {
    return this.db.find<InventoryItem[]>('art_id');
  }
  async updateInventory(inventory: InventoryItem[]) {
    return this.db.insert<InventoryItem[]>(inventory);
  }

  async getProducts(): Promise<Product[]> {
    return this.db.find<Product[]>('contain_articles');
  }

  async getProductByName(name: string): Promise<Product> {
    return this.db.find<Product>('name', name);
  }

  async updateProducts(products: Product[]): Promise<Product[]> {
    return this.db.insert<Product[]>(products);
  }

  async removeProductByName(name: string): Promise<void> {
    const product = await this.getProductByName(name);

    if (product) {
      const promises = product.contain_articles.map(async inventoryItem => {
        return this.db.filterAndUpdate(
          { art_id: inventoryItem.art_id },
          (item: InventoryItem) => {
            item.stock -= inventoryItem.amount_of;

            return item;
          },
        );
      });

      await Promise.all(promises);
      await this.db.remove('name', name);
    }
  }
}
