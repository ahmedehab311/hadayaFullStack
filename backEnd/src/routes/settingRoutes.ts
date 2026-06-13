import { Router } from 'express';
import {
    getAllSettings,
    getSettingsByCategory,
    upsertSetting,
    bulkUpsertSettings,
    deleteSetting,
    getPublicSettings
} from '../controllers/settingController';
import { authenticate } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

router.get('/public', getPublicSettings);

router.get('/', authenticate, getAllSettings);

router.get('/category/:category', authenticate, getSettingsByCategory);

router.post('/', authenticate, isAdmin, upsertSetting);
router.post('/bulk', authenticate, isAdmin, bulkUpsertSettings);


router.delete('/:key', authenticate, isAdmin, deleteSetting);

export default router;  