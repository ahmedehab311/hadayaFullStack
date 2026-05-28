import { Router } from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    uploadPaymentProof,
} from '../controllers/orderController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);
router.post('/:id/payment-proof', uploadPaymentProof);

export default router;