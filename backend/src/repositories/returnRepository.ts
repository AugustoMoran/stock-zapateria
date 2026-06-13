import Return, { IReturn } from '../models/Return';

class ReturnRepository {
  async create(data: Partial<IReturn>) {
    return await Return.create(data);
  }

  async find(query: any = {}) {
    return await Return.find(query).sort({ fecha: -1 });
  }

  async aggregate(pipeline: any[]) {
    return await Return.aggregate(pipeline);
  }
}

export default new ReturnRepository();