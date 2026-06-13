import Sale, { ISale } from '../models/Sale';

class SaleRepository {
  async create(saleData: Partial<ISale>) {
    return await Sale.create(saleData);
  }

  async find(query: any = {}) {
    return await Sale.find(query).sort({ fecha: -1 });
  }

  async aggregate(pipeline: any[]) {
    return await Sale.aggregate(pipeline);
  }
}

export default new SaleRepository();