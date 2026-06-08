import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySlug,
} from '../controllers/productController';
import { authenticate } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';
const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/slug/:slug', getProductBySlug);
router.post('/', authenticate, isAdmin, createProduct);
router.patch('/:id', authenticate, isAdmin, updateProduct);
router.delete('/:id', authenticate, isAdmin, deleteProduct);

export default router;