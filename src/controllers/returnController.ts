import { Request, Response } from 'express';
import returnService from '../services/returnService';

export const createReturn = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const returnRecord = await returnService.createReturn(req.body, userId);
    res.status(201).json(returnRecord);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getReturns = async (req: Request, res: Response) => {
  try {
    const returns = await returnService.getAllReturns();
    res.json(returns);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
