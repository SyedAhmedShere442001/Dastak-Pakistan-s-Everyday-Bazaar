import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = Router();
router.get('/stats', protect, adminOnly, getDashboardStats);

export default router;
