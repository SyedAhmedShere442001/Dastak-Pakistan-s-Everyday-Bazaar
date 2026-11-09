import { Router } from 'express';
import {
  addReview,
  createProduct,
  deleteProduct,
  getProductById,
  getProductBySlug,
  listAdminProducts,
  listProducts,
  listReviews,
  updateProduct
} from '../controllers/productController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = Router();

router.get('/', listProducts);
router.get('/admin/list', protect, adminOnly, listAdminProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/id/:id', protect, adminOnly, getProductById);
router.get('/:id/reviews', listReviews);
router.post('/:id/reviews', protect, addReview);

router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
