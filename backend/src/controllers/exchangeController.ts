import { Request, Response } from 'express';
import exchangeService from '../services/exchangeService';

export const createExchange = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { devuelto, entregado } = req.body;
    const exchange = await exchangeService.createExchange(devuelto, entregado, userId);
    res.status(201).json(exchange);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getExchanges = async (req: Request, res: Response) => {
  try {
    const exchanges = await exchangeService.getAllExchanges();
    res.json(exchanges);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
