import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AppService } from './app.service';
import { FileDto, ArticlesDto, ArticleDto } from './dto';
import { Article } from './interfaces';

@Controller('/')
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get(['', '/health'])
  async getHealth(): Promise<{ [k: string]: string }> {
    return { status: 'healthy' };
  }

  @Get('articles')
  async getArticles(): Promise<ArticlesDto> {
    const inventory = await this.service.getArticles();

    return { inventory };
  }

  @Get('articles/:id')
  async getArticleById(@Param('id') id: string): Promise<ArticleDto> {
    const found = await this.service.getArticleById(id);

    if (found) {
      return found;
    }

    throw new NotFoundException(`No such article found with id ${id}`);
  }

  @Put('articles')
  @UseInterceptors(FileInterceptor('file'))
  async updateArticles(@UploadedFile() file: FileDto): Promise<ArticlesDto> {
    const upload: ArticlesDto = JSON.parse(file.buffer.toString());

    const articles: Article[] = await this.service.updateArticles(
      upload.inventory,
    );

    return { inventory: articles };
  }
}
