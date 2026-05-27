import prisma from '../config/prismaClient';
import { Address, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

export type CreateAddressInput = {
    label?: string;
    city: string;
    street: string;
    building?: string;
    floor?: string;
    apartment?: string;
    landmark?: string;
    postalCode?: string;
    phone: string;
    isDefault?: boolean;
};

export type UpdateAddressInput = Partial<CreateAddressInput>;

export async function findUserAddresses(userId: string): Promise<Address[]> {
    return prisma.address.findMany({
        where: { userId },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
}

export async function findAddressById(
    id: string,
    userId: string
): Promise<Address | null> {
    return prisma.address.findFirst({
        where: { id, userId },
    });
}
export async function createAddress(
    userId: string,
    data: CreateAddressInput
): Promise<Address> {
    return prisma.$transaction(async (tx) => {
        if (data.isDefault) {
            await tx.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            })
        }
        const isFirstAddress =
            (await tx.address.count({ where: { userId } })) === 0;

        return tx.address.create({
            data: {
                ...data,
                userId,
                isDefault: isFirstAddress,
            },
        });


    })

}
export async function updateAddress(
    id: string,
    userId: string,
    data: UpdateAddressInput
): Promise<Address> {
    const address = await prisma.address.findFirst({ where: { id, userId } });
    if (!address) throw new AppError("Address not found", 404);
    return prisma.$transaction(async (tx) => {
        if (data.isDefault) {
            await tx.address.updateMany({
                where: { userId, isDefault: true, id: { not: id } },
                data: { isDefault: false },
            })
        }
        return tx.address.update({
            where: { id },
            data,
        });
    })
}

export async function deleteAddress(id: string, userId: string): Promise<void> {

    const address = await prisma.address.findFirst({ where: { id, userId } });

    if (!address) throw new AppError("Address not found", 404);


    const isLinkedToOrder = await prisma.order.findFirst({
        where: {
            OR: [{ buyerAddressId: id }, { recipientAddressId: id }],
        },
    });
    if (isLinkedToOrder) {
        throw new AppError(
            "Cannot delete address linked to an order",
            409
        );
    }
    await prisma.address.delete({ where: { id } });
}
export async function setDefaultAddress(id: string, userId: string): Promise<void> {

    const address = await prisma.address.findFirst({ where: { id, userId } });

    if (!address) throw new AppError("Address not found", 404);

    await prisma.$transaction(async (tx) => {
        await tx.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
        });
        await tx.address.update({
            where: { id },
            data: { isDefault: true },
        });
    });
    }