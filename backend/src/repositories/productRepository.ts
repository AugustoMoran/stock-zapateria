import Product, { IProduct } from '../models/Product';

class ProductRepository {
  async findAll(query: any = {}) {
    return await Product.find(query);
  }

  async findById(id: string) {
    return await Product.findById(id);
  }

  async findByExactMatch(fabrica: string, articulo: string, color: string) {
    return await Product.findOne({ fabrica, articulo, color });
  }

  async create(productData: Partial<IProduct>) {
    return await Product.create(productData);
  }

  async update(id: string, productData: Partial<IProduct>) {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async delete(id: string) {
    return await Product.deleteOne({ _id: id });
  }
}

export default new ProductRepository();