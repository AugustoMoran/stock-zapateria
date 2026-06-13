import express from 'express';
import { getFinancialReports, getAuditLogs, getStockMovements, getTopProducts } from '../controllers/adminController';
import { updateStockManual } from '../controllers/productController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/reports', protect, getFinancialReports);
router.get('/audit-logs', protect, getAuditLogs);
router.get('/movements', protect, getStockMovements);
router.get('/top-products', protect, getTopProducts);

// Admin dedicated stock adjustment
router.patch('/products/:id/stock', protect, updateStockManual);

export default router;
