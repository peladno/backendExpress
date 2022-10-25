import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductDocument } from './product.schema';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  createProduct(
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('image_url') image_url: string,
    @Body('code') code: string,
    @Body('stock') stock: number,
    @Body('description') description?: string,
  ) {
    return this.productService.create(
      name,
      price,
      image_url,
      code,
      stock,
      description,
    );
  }

  @Get()
  findAllProducts(): Promise<ProductDocument[]> {
    return this.productService.findAll();
  }

  @Get()
  findProduct(@Param('id') id: string): Promise<ProductDocument> {
    return this.productService.findProduct(id);
  }
}
