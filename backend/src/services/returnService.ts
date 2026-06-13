import returnRepository from '../repositories/returnRepository';
import productRepository from '../repositories/productRepository';
import StockMovement, { MovementType } from '../models/StockMovement';
import AuditLog from '../models/AuditLog';

class ReturnService {
  async createReturn(data: any, userId: string) {
    const { productId, talle, cantidad, montoDevuelto } = data;

    const product = await productRepository.findById(productId);
    if (!product) throw new Error('Product not found');

    // Increase stock
    (product.stock as any)[talle] += cantidad;
    await product.save();

    await StockMovement.create({
      productId: product._id,
      talle: talle,
      cantidad: cantidad,
      tipo: MovementType.DEVOLUCION,
      usuario: userId,
      descripcion: 'Entrada por devolución'
    });

    const returnRecord = await returnRepository.create({
      productId: product._id,
      fabrica: product.fabrica,
      articulo: product.articulo,
      color: product.color,
      talle,
      cantidad,
      montoDevuelto,
      costoUnitario: product.costo,
      usuario: userId,
      fecha: new Date()
    });

    await AuditLog.create({
      usuario: userId,
      accion: 'DEVOLUCION',
      detalles: `Devolución realizada ID: ${returnRecord._id}`
    });

    return returnRecord;
  }

  async getAllReturns() {
    return await returnRepository.find();
  }
}

export default new ReturnService();