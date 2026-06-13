import Exchange, { IExchange } from '../models/Exchange';

class ExchangeRepository {
  async create(data: Partial<IExchange>) {
    return await Exchange.create(data);
  }

  async find(query: any = {}) {
    return await Exchange.find(query).sort({ fecha: -1 });
  }
}

export default new ExchangeRepository();