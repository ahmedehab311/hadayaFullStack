import { Router } from 'express';
import { getMenu } from '../controllers/menucontroller';

const router = Router();

router.get('/', getMenu);

export default router;
