import prisma from '../config/prismaClient';
import { Collection, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

export type CreateCollectionInput = {
  nameAr: string;
  nameEn: string;
  slug: string;
  productIds?: string[];
};


export type UpdateCollectionInput = Partial<CreateCollectionInput>

export async function findAllCollections(): Promise<Collection[]> {
  return prisma.collection.findMany({
    orderBy: { nameEn: 'asc' },
    include: { products: true }
  })
}
export async function findCollectionById(id: string): Promise<Collection | null> {
  return prisma.collection.findUnique({
    where: { id },
    include: { products: true }
  })
}
export async function findCollectionBySlug(slug: string): Promise<Collection | null> {
  return prisma.collection.findFirst({
    where: { slug },
    include: { products: true }
  })
}
export async function createCollection(data: CreateCollectionInput): Promise<Collection> {
  const { productIds, ...collectionData } = data;
  return prisma.collection.create({
    data: {
      ...collectionData,
      ...(productIds?.length && {
        products: {
          connect: productIds.map((id) => ({ id }))
        }
      })
    },
    include: { products: true }
  })
}

export async function updateCollection(id: string, data: UpdateCollectionInput): Promise<Collection> {
  const { productIds, ...collectionData } = data;
  return prisma.collection.update({
    where: { id },
    data: {
      ...collectionData,
      ...(productIds?.length && {
        products: {
          connect: productIds.map((id) => ({ id }))
        }
      })
    },
    include: { products: true }
  })
}

export async function deleteCollection(id: string): Promise<Collection> {
  try {
    return prisma.collection.delete({ where: { id } })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('Collection not found', 404);
    }
    throw error;
  }
}

