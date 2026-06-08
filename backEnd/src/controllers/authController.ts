import { Request, Response, NextFunction } from 'express';
import { AppError } from "../utils/AppError";
import * as authService from '../services/authService'
import { sendSuccess } from "../utils/response";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name, phone , role} = req.body;


    if (!email || !password || !name) throw new AppError('All fields are required', 400);
    const result = await authService.registerUser({ email, password, name, phone , role});
    sendSuccess(res, result, 'Account created successfully', 201);
  } catch (error) {
    next(error);
  }

}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError('Email and password are required', 400);

    const result = await authService.tokenUser({ email, password });


    sendSuccess(res, result, 'Logged in successfully', 200);
  } catch (error) {
    next(error);
  }
}