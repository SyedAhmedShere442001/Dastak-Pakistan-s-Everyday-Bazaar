import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  listOrders,
  myOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createOrder);
router.get('/mine', protect, myOrders);
router.get('/admin', protect, adminOnly, listOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
router.get('/:id', protect, getOrderById);

export default router;
