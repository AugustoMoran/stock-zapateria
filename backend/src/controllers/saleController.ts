import { Request, Response } from 'express';
import saleService from '../services/saleService';

export const createSale = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { items, descuento } = req.body;
    const sale = await saleService.createSale(items, userId, descuento);
    res.status(201).json(sale);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getSales = async (req: Request, res: Response) => {
  try {
    const sales = await saleService.getSales(req.query);
    res.json(sales);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
