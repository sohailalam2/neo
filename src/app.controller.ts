import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AppService } from './app.service';
import { FileDto, InventoryDto, ProductsDto, ProductDto } from './dto';
import { InventoryItem, Product } from './interfaces';

@Controller('/')
export class AppController {
  constructor(private readonly service: AppService) {}

  /**
   * GET /health
   *
   * Get the health of the application
   */
  @Get(['', '/health'])
  async getHealth(): Promise<{ [k: string]: string }> {
    return { status: 'healthy' };
  }

  /**
   * GET /inventory
   *
   * Get the list of all inventory items
   */
  @Get('inventory')
  async getInventory(): Promise<InventoryDto> {
    const inventory = await this.service.getInventory();

    return { inventory };
  }

  /**
   * PUT /inventory
   *
   * Upload the list of inventory items to the db
   *
   * A 400 Bad Request error is sent if the upload file is corrupted or is not in the expected format
   *
   * @param file The file containing the inventory items
   */
  @Put('inventory')
  @UseInterceptors(FileInterceptor('file'))
  async updateInventory(@UploadedFile() file: FileDto): Promise<InventoryDto> {
    const upload: InventoryDto = JSON.parse(file.buffer.toString());

    if (!upload || !upload.inventory) {
      throw new BadRequestException(
        'Invalid inventory file... missing inventory items',
      );
    }

    const inventory: InventoryItem[] = await this.service.updateInventory(
      upload.inventory,
    );

    return { inventory };
  }

  /**
   * GET /products
   *
   * Get the list of products
   */
  @Get('products')
  async getProducts(): Promise<ProductsDto> {
    const products = await this.service.getProducts();

    return { products };
  }

  /**
   * PUT /products
   *
   * Upload the list of products to the db
   *
   * A 400 Bad Request error is sent if the upload file is corrupted or is not in the expected format
   *
   * @param file the file containing products information
   */
  @Put('products')
  @UseInterceptors(FileInterceptor('file'))
  async updateProducts(@UploadedFile() file: FileDto): Promise<ProductsDto> {
    const upload: ProductsDto = JSON.parse(file.buffer.toString());

    if (!upload || !upload.products) {
      throw new BadRequestException(
        'Invalid products file... missing products',
      );
    }

    const products: Product[] = await this.service.updateProducts(
      upload.products,
    );

    return { products };
  }

  /**
   * GET /products/:name
   *
   * Get a product by its name
   *
   * A 404 Not Found error response is sent if the item is not found
   *
   * @param name product name
   */
  @Get('products/:name')
  async getProductByName(@Param('name') name: string): Promise<ProductDto> {
    const found = await this.service.getProductByName(name);

    if (found) {
      return found;
    }

    throw new NotFoundException(`No such product found with name ${name}`);
  }

  /**
   * DELETE /products/:name
   *
   * Delete a given product and update the inventory stock
   *
   * @param name The name of the product
   */
  @Delete('products/:name')
  async removeProductByName(@Param('name') name: string): Promise<void> {
    await this.service.removeProductByName(name);
  }
}
