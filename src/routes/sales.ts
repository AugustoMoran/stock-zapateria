import express from 'express';
import { createSale, getSales } from '../controllers/saleController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, createSale);
router.get('/', protect, getSales);

export default router;
