import express from 'express';
import { createReturn, getReturns } from '../controllers/returnController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', protect, createReturn);
router.get('/', protect, getReturns);

export default router;
