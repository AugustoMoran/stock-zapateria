import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, updateStockManual } from '../controllers/productController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);

// Note: These should ideally also check for Admin Password authorization in the frontend
// but protect middleware is the minimum for the layer.
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.patch('/:id/stock', protect, updateStockManual);

export default router;
