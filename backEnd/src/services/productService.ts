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
  collectionIds?: string[];
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
export async function findProductBySlug(slug: string): Promise<Product | null> {
  return prisma.product.findFirst({ where: { slug },})
}
export async function createProduct(data: CreateProductInput): Promise<Product> {
  const { collectionIds, ...productData } = data;
  return prisma.product.create({
    data: {
      ...productData,
      status: productData.status ?? 'DRAFT',
      stock: productData.stock ?? 0,
      images: productData.images ?? [],
      isPersonalizable: productData.isPersonalizable ?? false,
      giftMessageEnabled: productData.giftMessageEnabled ?? false,
      attributes: productData.attributes ?? Prisma.JsonNull,
      isBestSeller: productData.isBestSeller ?? false,
      ...(collectionIds?.length && {
        collections: {
          connect: collectionIds.map((id) => ({ id })),
        },
      }),
    },
    include: { collections: true },
  });
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput
): Promise<Product> {
  const { collectionIds, ...productData } = data;

  try {
    return await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(collectionIds !== undefined && {
          collections: {
            set: collectionIds.map((cid) => ({ id: cid })),
          },
        }),
      },
      include: { collections: true },
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
    const linkedOrders = await prisma.orderItem.count({
      where: { productId: id },
    });

    if (linkedOrders > 0) {
      return await prisma.product.update({
        where: { id },
        data: { status: 'ARCHIVED' },
      });
    }

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