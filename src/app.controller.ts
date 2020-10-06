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
import { validateOrReject } from 'class-validator';

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
   * Update the inventory list with the given items
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

  @Get('products')
  async getProducts(): Promise<ProductsDto> {
    const products = await this.service.getProducts();

    return { products };
  }

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

  @Get('products/:name')
  async getProductByName(@Param('name') name: string): Promise<ProductDto> {
    const found = await this.service.getProductByName(name);

    if (found) {
      return found;
    }

    throw new NotFoundException(`No such product found with name ${name}`);
  }

  @Delete('products/:name')
  async removeProductByName(@Param('name') name: string): Promise<void> {
    await this.service.removeProductByName(name);
  }
}
