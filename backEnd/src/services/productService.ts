import prisma from '../config/prismaClient';
import { Product, Prisma, ProductStatus } from '@prisma/client';
import { AppError } from '../utils/AppError';

export type CreateProductInput = {
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: Prisma.Decimal | number | string;
  compareAtPrice?: Prisma.Decimal | number | string;
  status?: ProductStatus;
  stock?: number;
  imageUrl?: string;
  images?: string[];
  isPersonalizable?: boolean;
  giftMessageEnabled?: boolean;
  attributes?: Prisma.InputJsonValue;
  isBestSeller?: boolean;
  metaTitle?: string;
  metaDescription?: string;
};

export type UpdateProductInput = Partial<CreateProductInput>;

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
      slug: data.slug,
      nameAr: data.nameAr,
      nameEn: data.nameEn,
      descriptionAr: data.descriptionAr,
      descriptionEn: data.descriptionEn,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      status: data.status ?? 'DRAFT',
      stock: data.stock ?? 0,
      imageUrl: data.imageUrl,
      images: data.images ?? [],
      isPersonalizable: data.isPersonalizable ?? false,
      giftMessageEnabled: data.giftMessageEnabled ?? false,
      attributes: data.attributes ?? Prisma.JsonNull,
      isBestSeller: data.isBestSeller ?? false,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
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