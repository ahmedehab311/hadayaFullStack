import prisma from '../config/prismaClient';
import { OrderStatus, DeliveryType, PaymentMethod, Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';
export type OrderItemInput = {
    productId: string;
    quantity: number;
    giftMessage?: string;
    isGiftWrapped?: boolean;
    hasGreetingCard?: boolean;
};

export type CreateOrderInput = {
    deliveryType: DeliveryType;
    paymentMethod: PaymentMethod;
    items: OrderItemInput[];

    // SELF
    buyerAddressId?: string;

    // GIFT_DIRECT
    recipientName?: string;
    recipientPhone?: string;
    recipientEmail?: string;
};

async function generateOrderNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const count = await prisma.order.count({
        where: {
            createdAt: { gtr: startOfDay, lte: endOfDay }
        }
    })
    const serial = String(count + 1).padStart(4, '0');


    return `HAD-${dateStr}-${serial}`;

}


