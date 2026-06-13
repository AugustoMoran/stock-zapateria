import exchangeRepository from '../repositories/exchangeRepository';
import productRepository from '../repositories/productRepository';
import StockMovement, { MovementType } from '../models/StockMovement';
import AuditLog from '../models/AuditLog';

class ExchangeService {
  async createExchange(devuelto: any, entregado: any, userId: string) {
    // 1. Process Devuelto (Increase stock)
    const productDev = await productRepository.findById(devuelto.productId);
    if (!productDev) throw new Error('Returned product not found');

    (productDev.stock as any)[devuelto.talle] += devuelto.cantidad;
    await productDev.save();

    await StockMovement.create({
      productId: productDev._id,
      talle: devuelto.talle,
      cantidad: devuelto.cantidad,
      tipo: MovementType.CAMBIO_ENTRADA,
      usuario: userId,
      descripcion: 'Entrada por cambio'
    });

    // 2. Process Entregado (Decrease stock)
    const productEnt = await productRepository.findById(entregado.productId);
    if (!productEnt) throw new Error('Delivered product not found');

    if ((productEnt.stock as any)[entregado.talle] < entregado.cantidad) {
      throw new Error('Insufficient stock for delivered product');
    }

    (productEnt.stock as any)[entregado.talle] -= entregado.cantidad;
    await productEnt.save();

    await StockMovement.create({
      productId: productEnt._id,
      talle: entregado.talle,
      cantidad: -entregado.cantidad,
      tipo: MovementType.CAMBIO_SALIDA,
      usuario: userId,
      descripcion: 'Salida por cambio'
    });

    const diferencia = productEnt.precioPublico - productDev.precioPublico;
    const diferenciaCosto = productEnt.costo - productDev.costo;

    const exchange = await exchangeRepository.create({
      productoDevuelto: {
        productId: productDev._id,
        fabrica: productDev.fabrica,
        articulo: productDev.articulo,
        color: productDev.color,
        talle: devuelto.talle,
        cantidad: devuelto.cantidad,
        costo: productDev.costo
      },
      productoEntregado: {
        productId: productEnt._id,
        fabrica: productEnt.fabrica,
        articulo: productEnt.articulo,
        color: productEnt.color,
        talle: entregado.talle,
        cantidad: entregado.cantidad,
        costo: productEnt.costo
      },
      diferenciaPrecio: diferencia,
      diferenciaCosto: diferenciaCosto,
      usuario: userId,
      fecha: new Date()
    });

    await AuditLog.create({
      usuario: userId,
      accion: 'CAMBIO',
      detalles: `Cambio realizado ID: ${exchange._id}`
    });

    return exchange;
  }

  async getAllExchanges() {
    return await exchangeRepository.find();
  }
}

export default new ExchangeService();