import prisma from '../config/prismaClient';
import { Product, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

export type CreateProductInput = {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  imageUrl?: string;
};

export type UpdateProductInput = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
};

export async function findAllProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function findProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id } });
}

export async function createProduct(data: CreateProductInput): Promise<Product> {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock ?? 0,
      imageUrl: data.imageUrl,
    },
  });
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput
): Promise<Product> {
  try {
    return await prisma.product.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new AppError(`Product with id ${id} not found`, 404);
    }
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<Product> {
  try {
    return await prisma.product.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new AppError(`Product with id ${id} not found`, 404);
    }
    throw error;
  }
}