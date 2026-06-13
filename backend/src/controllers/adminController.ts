import { Request, Response } from 'express';
import adminService from '../services/adminService';

export const getFinancialReports = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;
    const reports = await adminService.getFinancialReports(from as string, to as string);
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const logs = await adminService.getAuditLogs();
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStockMovements = async (req: Request, res: Response) => {
  try {
    const movements = await adminService.getStockMovements();
    res.json(movements);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;
    const topProducts = await adminService.getTopProducts(from as string, to as string);
    res.json(topProducts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
