import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(
    name: string,
    price: number,
    image_url: string,
    code: string,
    stock: number,
    description: string,
  ): Promise<ProductDocument> {
    const newProduct = new this.productModel({
      name,
      price,
      description,
      image_url,
      code,
      stock,
    });
    return newProduct.save();
  }

  async findAll(): Promise<ProductDocument[]> {
    return this.productModel.find().exec();
  }

  async findProduct(id: string): Promise<ProductDocument> {
    return this.productModel.findById(id).exec();
  }
}
