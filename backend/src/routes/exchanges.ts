import express from 'express';
import { createExchange, getExchanges } from '../controllers/exchangeController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, createExchange);
router.get('/', protect, getExchanges);

export default router;
