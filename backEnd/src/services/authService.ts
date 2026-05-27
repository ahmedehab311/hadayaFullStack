

import prisma from '../config/prismaClient';
import bcrypt from 'bcrypt';
import { generateToken } from '../middlewares/jwt';
import { AppError } from '../utils/AppError';
export type UserInput = {
  email: string;
  name: string;
  password: string;
  phone?: string;
};

export type LoginInput = Pick<UserInput, 'email' | 'password'>;

export const registerUser = async (userData: UserInput) => {

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword
    }
  });

  const token = generateToken(user.id, user.role);

  return { user, token };

}
export const tokenUser = async (userData: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: userData.email } });
  if (!user || !user.password) throw new AppError("this user doesn't exist", 401);

  // const isMatch = await bcrypt.hash(userData.password, 10);
  const isMatch = await bcrypt.compare(userData.password, user.password);
  if (!isMatch) throw new AppError("password doesn't match", 401);
  const token = generateToken(user.id, user.role);

  return { user, token };

}