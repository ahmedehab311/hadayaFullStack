import prisma from '../config/prismaClient';
import { User, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AppError } from '../utils/AppError';
export type CreateUserInput = {
email: string;
password: string;
name: string;
};

export type UpdateUserInput = {
email?: string;
password?: string;
name?: string;  
};

export async function findAllUsers(): Promise<User[]> {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

/**
 * Create a new user record.
 */
export async function createUser(data: Prisma.UserCreateInput): Promise<User> {
  return prisma.user.create({ data });
}


export async function updateUser(id: string, data: UpdateUserInput) {
  try {
    if (data.password && typeof data.password === 'string') {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await prisma.user.update({ where: { id }, data });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new Error(`User with id ${id} not found`);
    }
    throw error;
  }
}
export async function deleteUser(id: string): Promise<User> {
  try {
    return await prisma.user.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new Error(`User with id ${id} not found`);
    }
    throw error;
  }
}
