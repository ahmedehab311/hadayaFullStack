import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';

// ─── GET /api/users ───────────────────────────────────────────────────────────
export async function getAllUsers(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await userService.findAllUsers();
    sendSuccess(res, users, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
}

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) throw new AppError('Invalid user ID', 400);

    const user = await userService.findUserById(id);
    if (!user) throw new AppError('User not found', 404);

    sendSuccess(res, user, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
}

// ─── POST /api/users ──────────────────────────────────────────────────────────
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email } = req.body as { name: string; email: string };
    if (!name || !email) throw new AppError('Name and email are required', 400);

    const user = await userService.createUser({ name, email });
    sendSuccess(res, user, 'User created successfully', 201);
  } catch (error) {
    next(error);
  }
}

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) throw new AppError('Invalid user ID', 400);

    const data = req.body as { name?: string; email?: string };
    const user = await userService.updateUser(id, data);

    sendSuccess(res, user, 'User updated successfully');
  } catch (error) {
    next(error);
  }
}

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string, 10);
    if (isNaN(id)) throw new AppError('Invalid user ID', 400);

    await userService.deleteUser(id);
    sendSuccess(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
}
