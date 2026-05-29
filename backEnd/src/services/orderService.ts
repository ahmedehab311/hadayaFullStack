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
            createdAt: { gte: startOfDay, lte: endOfDay }
        }
    })
    const serial = String(count + 1).padStart(4, '0');


    return `HAD-${dateStr}-${serial}`;

}

async function resolveDeliveryFee(_zoneId?: string): Promise<number> {
    const setting = await prisma.setting.findUnique({
        where: { key: 'delivery_fee' }
    })
    return Number(setting?.value ?? 0);
    // المرحلة القادمة

    // const zone = await prisma.deliveryZone.findUnique({ where: { id: zoneId } });
    // return Number(zone?.fee ?? 0);
}

export async function createOrder(buyerId: string, data: CreateOrderInput) {
    if (data.deliveryType === DeliveryType.SELF && !data.buyerAddressId) {
        throw new AppError('Buyer address is required for self-delivery orders', 400);
    }
    if (data.deliveryType === DeliveryType.GIFT_DIRECT && !data.recipientName) {
        throw new AppError('Recipient name is required for gift direct orders', 400);
    }
    if (data.paymentMethod === PaymentMethod.COD && data.deliveryType !== DeliveryType.SELF) {
        throw new AppError('Cash payment is only allowed for self-delivery orders', 400);
    }
    const productIds = data.items.map((i) => i.productId);

    const products = await prisma.product.findMany({
        where: { id: { in: productIds }, status: "PUBLISHED" }
    })

    if (products.length !== productIds.length) {
        throw new AppError('One or more products are invalid or not available', 404);
    }

    for (const item of data.items) {
        const product = products.find((p) => p.id === item.productId)
        if ((product?.stock ?? 0) < item.quantity) {
            throw new AppError(`Insufficient stock for product: ${product?.nameEn}`, 409);
        }
    }
    const deliveryFee = await resolveDeliveryFee();
    const GIFT_WRAPPING_FEE = 20;
    const GREETING_CARD_FEE = 10;

    let giftWrappingFee = 0;
    let greetingCardFee = 0;

    const itemWithPrices = data.items.map((item) => {
        const product = products.find((p) => p.id === item.productId)

        const unitPrice = Number(product?.price);

        const subtotal = unitPrice * item.quantity;

        if (item.isGiftWrapped) giftWrappingFee += GIFT_WRAPPING_FEE
        if (item.hasGreetingCard) greetingCardFee += GREETING_CARD_FEE

        return { ...item, unitPrice, subtotal };
    })
    const subTotal = itemWithPrices.reduce((sum, item) => sum + item.subtotal, 0)

    const totalAmount = subTotal + deliveryFee + giftWrappingFee + greetingCardFee
    return prisma.$transaction(async (tx) => {
        const orderNumber = await generateOrderNumber()
        const order = await tx.order.create({
            data: {
                orderNumber, buyerId,
                deliveryType: data.deliveryType,
                paymentMethod: data.paymentMethod,

                buyerAddressId: data.buyerAddressId ?? null,

                recipientName: data.recipientName ?? null,
                recipientPhone: data.recipientPhone ?? null,
                recipientEmail: data.recipientEmail ?? null,

                subtotal: new Prisma.Decimal(subTotal),
                deliveryFee: new Prisma.Decimal(deliveryFee),
                giftWrappingFee: new Prisma.Decimal(giftWrappingFee),
                greetingCardFee: new Prisma.Decimal(greetingCardFee),
                discount: new Prisma.Decimal(0),
                totalAmount: new Prisma.Decimal(totalAmount),

                status: data.paymentMethod === PaymentMethod.COD ? OrderStatus.PAID
                    : OrderStatus.PENDING_PAYMENT,

                items: {
                    create: itemWithPrices.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: new Prisma.Decimal(item.unitPrice),
                        subtotal: new Prisma.Decimal(item.subtotal),
                        giftMessage: item.giftMessage ?? null,
                        isGiftWrapped: item.isGiftWrapped ?? false,
                        hasGreetingCard: item.hasGreetingCard ?? false,
                    }))
                },
            },
            include: { items: true },
        })
        for (const item of data.items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            })
        }

        if (data.deliveryType === DeliveryType.GIFT_DIRECT) {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            await tx.giftToken.create({
                data: {
                    orderId: order.id,
                    token: crypto.randomUUID(),
                    expiresAt,
                },
            });
        }
        await tx.orderStatusHistory.create({
            data: {
                orderId: order.id,
                status: order.status,
                createdAt: new Date(),
                changedBy: buyerId,
                notes: 'Order created'
            }
        })
        return tx.order.findUnique({
            where: { id: order.id },
            include: {
                items: { include: { product: true } },
                buyerAddress: true,
                giftToken: true,
                statusHistory: true,
            }
        })
    })
}
export async function findMyOrders(buyerId: string) {
    return prisma.order.findMany({
        where: { buyerId },
        orderBy: { createdAt: 'desc' },
        include: {
            items: { include: { product: { select: { nameAr: true, imageUrl: true } } } },
            giftToken: { select: { token: true, status: true } },
        },
    });
}
export async function findOrderById(id: string, buyerId: string) {
    const order = await prisma.order.findFirst({
        where: { id, buyerId },
        orderBy: { createdAt: 'desc' },
        include: {
            items: { include: { product: true } },
            buyerAddress: true,
            recipientAddress: true,
            giftToken: true,
            paymentProof: true,
            statusHistory: { orderBy: { createdAt: 'asc' } },
        },
    });
    if (!order) throw new AppError('Order not found', 404);
    return order;
}


export async function addPaymentProof(
    orderId: string,
    buyerId: string,
    imageUrl: string,
    method: PaymentMethod
) {
    const order = await prisma.order.findFirst({
        where: { id: orderId, buyerId },
    });
    if (!order) throw new AppError('Order not found', 404)
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw new AppError('Payment proof can only be added to orders pending payment', 409);
    }

    const manualMethods: PaymentMethod[] = [PaymentMethod.VODAFONE_CASH, PaymentMethod.INSTAPAY]

    if (!manualMethods.includes(method)) {
        throw new AppError('Invalid payment method', 400);
    }


    return prisma.$transaction(async (tx) => {
        const proof = await tx.paymentProof.create({
            data: { orderId, imageUrl, method }
        })

        await tx.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.PENDING_VERIFICATION }
        })
        await tx.orderStatusHistory.create({
            data: {
                orderId,
                status: OrderStatus.PENDING_VERIFICATION,
                changedBy: buyerId,
                notes: 'Payment proof added, pending verification',
            },
        });
        return proof;
    });
}
export async function cancelOrder(
    id: string,
    buyerId: string,

) {
    const order = await prisma.order.findFirst({
        where: { id, buyerId },
    });
    if (!order) throw new AppError('Order not found', 404)


    const cancellableStatuses: OrderStatus[] = [
        OrderStatus.PENDING_PAYMENT,
        OrderStatus.PENDING_VERIFICATION,
    ];

    if (!cancellableStatuses.includes(order.status)) {
        throw new AppError('Order cannot be cancelled', 409);
    }
    return prisma.$transaction(async (tx) => {
        const items = await tx.orderItem.findMany({ where: { orderId: id } });
        for (const item of items) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } }
            })
        }

        const updated = await tx.order.update({
            where: { id },
            data: {
                status: OrderStatus.CANCELLED,
                cancelledAt: new Date(),
            },
        });

        await tx.orderStatusHistory.create({
            data: {
                orderId: id,
                status: OrderStatus.CANCELLED,
                changedBy: buyerId,
                notes: "Order cancelled by buyer",
            },
        });

        return updated;

    })


}