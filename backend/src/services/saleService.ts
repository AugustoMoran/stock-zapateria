import saleRepository from '../repositories/saleRepository';
import productRepository from '../repositories/productRepository';
import StockMovement, { MovementType } from '../models/StockMovement';
import AuditLog from '../models/AuditLog';

class SaleService {
  async createSale(items: any[], userId: string) {
    let totalVenta = 0;
    let totalCosto = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await productRepository.findById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      const currentStock = (product.stock as any)[item.talle];
      if (currentStock < item.cantidad) {
        throw new Error(`Insufficient stock for ${product.articulo} size ${item.talle}`);
      }

      // Subtract stock
      (product.stock as any)[item.talle] -= item.cantidad;
      await product.save();

      // Calculate financials
      const itemPrice = product.precioPublico * item.cantidad;
      const itemCost = product.costo * item.cantidad;
      totalVenta += itemPrice;
      totalCosto += itemCost;

      saleItems.push({
        productId: product._id,
        fabrica: product.fabrica,
        articulo: product.articulo,
        color: product.color,
        talle: item.talle,
        cantidad: item.cantidad,
        precioVenta: product.precioPublico,
        costoVenta: product.costo
      });

      // Stock movement
      await StockMovement.create({
        productId: product._id,
        talle: item.talle,
        cantidad: -item.cantidad,
        tipo: MovementType.VENTA,
        usuario: userId,
        descripcion: `Venta de ${item.cantidad} unidades`
      });
    }

    const sale = await saleRepository.create({
      items: saleItems,
      totalVenta,
      totalCosto,
      totalGanancia: totalVenta - totalCosto,
      usuario: userId as any,
      fecha: new Date()
    });

    await AuditLog.create({
      usuario: userId as any,
      accion: 'VENTA',
      detalles: `Venta realizada ID: ${sale._id}, Total: ${totalVenta}`
    });

    return sale;
  }

  async getSales(filters: any) {
    const { from, to } = filters;
    const query: any = {};
    if (from && to) {
      query.fecha = { $gte: new Date(from as string), $lte: new Date(to as string) };
    }
    return await saleRepository.find(query);
  }
}

export default new SaleService();