import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController';
import { authenticate } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

router.get('/stats', authenticate, isAdmin, getDashboardData);

export default router;