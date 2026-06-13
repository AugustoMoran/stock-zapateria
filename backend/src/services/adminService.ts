import saleRepository from '../repositories/saleRepository';
import returnRepository from '../repositories/returnRepository';
import exchangeRepository from '../repositories/exchangeRepository';
import StockMovement from '../models/StockMovement';
import AuditLog from '../models/AuditLog';

class AdminService {
  async getFinancialReports(from?: string, to?: string) {
    const start = from ? new Date(from + 'T00:00:00') : new Date();
    start.setHours(0, 0, 0, 0);
    
    const end = to ? new Date(to + 'T23:59:59') : new Date();
    end.setHours(23, 59, 59, 999);

    console.log('Fetching reports from:', start.toISOString(), 'to:', end.toISOString());

    const query = { fecha: { $gte: start, $lte: end } };
    const [sales, returns, exchanges] = await Promise.all([
      saleRepository.find(query),
      returnRepository.find(query),
      exchangeRepository.find(query)
    ]);

    // Financial breakdown with common sense logic:
    // Net Income = Gross Sales + Exchange Differences - Returns
    // Net Cost = Cost of Sales + Cost differences from Exchanges - Cost of returned items back in stock

    const grossSalesRevenue = sales.reduce((acc, sale) => acc + sale.totalVenta, 0);
    const exchangeRevenueDiff = exchanges.reduce((acc, ex) => acc + (ex.diferenciaPrecio || 0), 0);
    const totalMontoDevuelto = returns.reduce((acc, ret) => acc + ret.montoDevuelto, 0);

    const netRevenue = grossSalesRevenue + exchangeRevenueDiff - totalMontoDevuelto;

    const salesCost = sales.reduce((acc, sale) => acc + sale.totalCosto, 0);
    const exchangeCostDiff = exchanges.reduce((acc, ex) => acc + (ex.diferenciaCosto || 0), 0);
    const returnsCostRecovered = returns.reduce((acc, ret) => acc + (ret.costoUnitario * ret.cantidad || 0), 0);

    const netCost = salesCost + exchangeCostDiff - returnsCostRecovered;

    const netProfit = netRevenue - netCost;

    return {
      totalIngresos: netRevenue,
      totalCostos: netCost,
      totalMontoDevuelto,
      exchangeRevenueDiff,
      netProfit,
      cantidadVentas: sales.length,
      cantidadDevoluciones: returns.length,
      cantidadCambios: exchanges.length
    };
  }

  async getAuditLogs() {
    return await AuditLog.find()
      .populate('usuario', 'username')
      .sort({ fecha: -1 })
      .limit(100);
  }

  async getStockMovements() {
    return await StockMovement.find()
      .populate('productId', 'fabrica articulo color')
      .populate('usuario', 'username')
      .sort({ fecha: -1 })
      .limit(100);
  }

  async getTopProducts(from?: string, to?: string) {
    const start = from ? new Date(from + 'T00:00:00') : new Date();
    start.setHours(0, 0, 0, 0);

    const end = to ? new Date(to + 'T23:59:59') : new Date();
    end.setHours(23, 59, 59, 999);

    return await saleRepository.aggregate([
      { $match: { fecha: { $gte: start, $lte: end } } },
      { $unwind: '$items' },
      { $group: {
        _id: { articulo: '$items.articulo', fabrica: '$items.fabrica', color: '$items.color' },
        cantidadVendida: { $sum: '$items.cantidad' },
        totalRecaudado: { $sum: '$items.precioVenta' }
      }},
      { $sort: { cantidadVendida: -1 } },
      { $limit: 10 }
    ]);
  }
}

export default new AdminService();