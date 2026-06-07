import { Router } from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    uploadPaymentProof,
    updateOrder,
} from '../controllers/orderController';
import { authenticate } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);
router.post('/:id/payment-proof', uploadPaymentProof);
router.patch('/:id', authenticate, isAdmin, updateOrder);
export default router;