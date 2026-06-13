import { Request, Response } from 'express';
import productService from '../services/productService';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts(req.query);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const product = await productService.createProduct(req.body, userId);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const updatedProduct = await productService.updateProduct(req.params.id, req.body, userId);
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const result = await productService.deleteProduct(req.params.id, userId);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateStockManual = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const product = await productService.updateStockManual(req.params.id, req.body, userId);
    res.json(product);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
