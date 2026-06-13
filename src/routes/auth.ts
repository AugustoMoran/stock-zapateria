import express from 'express';
import { login, refresh, logout, verifyAdminPassword, changeAdminPassword, updateProfile } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/verify-admin', protect, verifyAdminPassword);
router.post('/change-admin-password', protect, changeAdminPassword);
router.put('/update-profile', protect, updateProfile);

export default router;
