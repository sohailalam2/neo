import { Injectable } from '@nestjs/common';
import { DbService } from './db/db.service';

import { InventoryItem, Product } from './interfaces';

@Injectable()
export class AppService {
  constructor(private readonly db: DbService) {}

  /**
   * Get the list of inventory items from the database
   */
  async getInventory(): Promise<InventoryItem[]> {
    return this.db.find<InventoryItem[]>('art_id');
  }

  /**
   * Add inventory items to the db
   *
   * @param inventory list of inventory items
   */
  async updateInventory(inventory: InventoryItem[]) {
    return this.db.insert<InventoryItem[]>(inventory);
  }

  /**
   * Get the list of products from the db
   */
  async getProducts(): Promise<Product[]> {
    return this.db.find<Product[]>('contain_articles');
  }

  /**
   * Search for a product by its name
   *
   * NOTE: We can improve the db structure to add a unique product id and instead
   * search the product by its id
   *
   * @param name product name
   */
  async getProductByName(name: string): Promise<Product> {
    return this.db.find<Product>('name', name);
  }

  /**
   * Add the list of products to the database
   *
   * @param products list of products
   */
  async updateProducts(products: Product[]): Promise<Product[]> {
    return this.db.insert<Product[]>(products);
  }

  /**
   * Remove the product from the db and also update the inventory stock count
   *
   * Ideally the delete and update operations should be executed in a transactions,
   * however, in this we are using an in-memory db to keep things simple
   *
   * @param name name of the product
   */
  async removeProductByName(name: string): Promise<void> {
    const product = await this.getProductByName(name);

    if (product) {
      const promises = product.contain_articles.map(async inventoryItem => {
        return this.db.filterAndUpdate(
          { art_id: inventoryItem.art_id },
          (item: InventoryItem) => {
            item.stock -= inventoryItem.amount_of; // update the stock count

            return item;
          },
        );
      });

      await Promise.all(promises);
      await this.db.remove('name', name);
    }
  }
}
