import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { changeUserRole } from '../services/user.service';
import { isAdmin } from '../middlewares/isAdmin';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.post('/', createUser);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);


// router.get('/', authenticate, isAdmin, getAllUsers);

// router.get('/:id', authenticate, isAdmin, getUserById);

// router.post('/', authenticate, isAdmin, createUser);

// router.patch('/:id', authenticate, isAdmin, updateUser);

// router.delete('/:id', authenticate, isAdmin, deleteUser);
// router.patch('/:id/role', authenticate, isAdmin, changeUserRole);
export default router;
