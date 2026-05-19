import { Router } from 'express';
import {
    getAllCollections,
    getCollectionById,
    getCollectionBySlug,
    createCollection,
    updateCollection,
    deleteCollection,
} from '../controllers/collectionController';
import { authenticate } from '../middlewares/auth';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

router.get('/', getAllCollections);
router.get('/:id', getCollectionById);
router.get('/slug/:slug', getCollectionBySlug);
router.post('/', authenticate, isAdmin, createCollection);
router.patch('/:id', authenticate, isAdmin, updateCollection);
router.delete('/:id', authenticate, isAdmin, deleteCollection);

export default router;