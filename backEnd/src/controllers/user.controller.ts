import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';

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

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
   const id = req.params['id'] as string;

    if (!id) throw new AppError('Invalid user ID', 400);

    const user = await userService.findUserById(id);
    if (!user) throw new AppError('User not found', 404);

    sendSuccess(res, user, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export async function createUser(req:Request ,res:Response,next:NextFunction):Promise<void> 
{ 
try{
  const {email,password,name} = req.body as {email:string,password:string,name:string};
if(!email || !password   || !name) throw new AppError('All fields are required',400);
const user=  await userService.createUser ({email,password,name})
sendSuccess(res, user, 'User created successfully', 201);
}catch(error){
  next(error);
}
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;

    if (!id) throw new AppError('Invalid user ID', 400);

    const data = req.body as {email?: string; password?: string; name?: string};

    if (!data.email && !data.password && !data.name) {
      throw new AppError('At least one field (email, password, name) is required for update', 400);
    }

    const user = await userService.updateUser(id, data);

    sendSuccess(res, user, 'User updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;

    if (!id) throw new AppError('Invalid user ID', 400);

    await userService.deleteUser(id);
    sendSuccess(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
}
