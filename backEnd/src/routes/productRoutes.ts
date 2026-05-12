import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';
const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', authenticate, isAdmin, createProduct);
router.patch('/:id', authenticate, isAdmin, updateProduct);
router.delete('/:id', authenticate, isAdmin, deleteProduct);

export default router;