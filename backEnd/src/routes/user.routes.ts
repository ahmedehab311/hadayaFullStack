import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router = Router();

// GET  /api/users        → list all users
router.get('/', getAllUsers);

// GET  /api/users/:id    → get single user
router.get('/:id', getUserById);

// POST /api/users        → create user
router.post('/', createUser);

// PUT  /api/users/:id    → update user
router.patch('/:id', updateUser);

// DELETE /api/users/:id  → delete user
router.delete('/:id', deleteUser);

export default router;
