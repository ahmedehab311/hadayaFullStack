import prisma from '../config/prismaClient';
import { User, Prisma } from '@prisma/client';

// ─── Types ────────────────────────────────────────────────────────────────────
export type CreateUserInput = {
  name: string;
  email: string;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
};

// ─── Service Methods ──────────────────────────────────────────────────────────

/**
 * Retrieve all users from the database.
 */
export async function findAllUsers(): Promise<User[]> {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Find a single user by their primary key.
 */
export async function findUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

/**
 * Create a new user record.
 */
export async function createUser(data: CreateUserInput): Promise<User> {
  return prisma.user.create({ data });
}

/**
 * Update an existing user by ID.
 */
export async function updateUser(
  id: number,
  data: UpdateUserInput
): Promise<User> {
  try {
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

/**
 * Delete a user by ID.
 */
export async function deleteUser(id: number): Promise<User> {
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
