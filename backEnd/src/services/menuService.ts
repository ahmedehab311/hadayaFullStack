import prisma from '../config/prismaClient';
import { Prisma } from '@prisma/client';

const menuQuery = {
    orderBy: { name: 'asc' },
    where: {
        products: {
            some: {
                status: 'PUBLISHED'
            }
        }
    },
    include: {
        products: {
            where: { status: 'PUBLISHED' as const },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                slug: true,
                nameAr: true,
                nameEn: true,
                price: true,
                compareAtPrice: true,
                imageUrl: true,
                images: true,
                isBestSeller: true,
                status: true,
                stock: true,
                createdAt: true,
            }
        }
    }
} satisfies Prisma.CollectionFindManyArgs

export type menuResult = Prisma.CollectionGetPayload<typeof menuQuery>

export async function getMenu(): Promise<menuResult[]> {
    return prisma.collection.findMany(menuQuery)
}