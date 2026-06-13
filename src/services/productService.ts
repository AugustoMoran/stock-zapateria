import productRepository from '../repositories/productRepository';
import StockMovement, { MovementType } from '../models/StockMovement';
import AuditLog from '../models/AuditLog';

class ProductService {
  async getAllProducts(filters: any) {
    const { fabrica, articulo, color, search } = filters;
    const query: any = {};

    if (fabrica) query.fabrica = { $regex: fabrica, $options: 'i' };
    if (articulo) query.articulo = { $regex: articulo, $options: 'i' };
    if (color) query.color = { $regex: color, $options: 'i' };
    
    if (search) {
      query.$or = [
        { fabrica: { $regex: search, $options: 'i' } },
        { articulo: { $regex: search, $options: 'i' } },
        { color: { $regex: search, $options: 'i' } }
      ];
    }

    return await productRepository.findAll(query);
  }

  async getProductById(id: string) {
    return await productRepository.findById(id);
  }

  async createProduct(data: any, userId: string) {
    const { fabrica, articulo, color, costo, precioPublico, stock } = data;

    const productExists = await productRepository.findByExactMatch(fabrica, articulo, color);
    if (productExists) {
      throw new Error('Product already exists');
    }

    const product = await productRepository.create({
      fabrica,
      articulo,
      color,
      costo,
      precioPublico,
      stock
    });

    const sizes = Object.keys(stock) as any[];
    for (const talle of sizes) {
      if (stock[talle] > 0) {
        await StockMovement.create({
          productId: product._id,
          talle,
          cantidad: stock[talle],
          tipo: MovementType.CARGA_INICIAL,
          usuario: userId,
          descripcion: 'Carga inicial de producto'
        });
      }
    }

    await AuditLog.create({
      usuario: userId,
      accion: 'PRODUCT_CREATE',
      detalles: `Creado producto: ${fabrica} ${articulo} ${color}`
    });

    return product;
  }

  async updateProduct(id: string, data: any, userId: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new Error('Product not found');

    const updatedProduct = await productRepository.update(id, data);

    await AuditLog.create({
      usuario: userId,
      accion: 'PRODUCT_UPDATE',
      detalles: `Actualizado producto ID: ${id}`
    });

    return updatedProduct;
  }

  async deleteProduct(id: string, userId: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new Error('Product not found');

    await productRepository.delete(id);

    await AuditLog.create({
      usuario: userId,
      accion: 'PRODUCT_DELETE',
      detalles: `Eliminado producto: ${product.fabrica} ${product.articulo} ${product.color}`
    });

    return { message: 'Product removed' };
  }

  async updateStockManual(productId: string, data: any, userId: string) {
    const { talle, cantidad, tipo, descripcion } = data;
    const product = await productRepository.findById(productId);

    if (!product) throw new Error('Product not found');

    const currentStock = (product.stock as any)[talle] || 0;
    (product.stock as any)[talle] = currentStock + cantidad;

    await product.save();

    await StockMovement.create({
      productId: product._id,
      talle,
      cantidad,
      tipo: tipo || MovementType.AJUSTE_MANUAL,
      usuario: userId,
      descripcion: descripcion || 'Ajuste manual de stock'
    });

    await AuditLog.create({
      usuario: userId,
      accion: 'STOCK_MOD',
      detalles: `Ajuste manual stock ${product.articulo} talle ${talle}: ${cantidad}`
    });

    return product;
  }
}

export default new ProductService();