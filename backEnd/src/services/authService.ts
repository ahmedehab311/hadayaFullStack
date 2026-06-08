

import prisma from '../config/prismaClient';
import bcrypt from 'bcrypt';
import { generateToken } from '../middlewares/jwt';
import { AppError } from '../utils/AppError';
import { Role } from '@prisma/client';
export type UserInput = {
  email: string;
  name: string;
  password: string;
  phone?: string;
  role?: Role;
};

export type LoginInput = Pick<UserInput, 'email' | 'password'>;

export const registerUser = async (userData: UserInput) => {

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      password: hashedPassword,
      role: userData.role || Role.USER,
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