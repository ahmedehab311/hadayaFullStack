import prisma from '../config/prismaClient';
import { OrderStatus } from '@prisma/client';

export async function getDashboardStats() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
        totalOrders,
        pendingOrders,
        deliveredOrders,
        todayOrders,
        totalProducts,
        revenueResult,
        recentActivity,
        statusDistribution,
    ] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({
            where: {
                status: {
                    in: [
                        OrderStatus.PENDING_PAYMENT,
                        OrderStatus.PENDING_VERIFICATION,
                        OrderStatus.PROCESSING,
                    ]
                }
            }
        }),
        prisma.order.count({
            where: {
                status: OrderStatus.DELIVERED
            }
        }),
        prisma.order.count({
            where: {
                createdAt: { gte: startOfToday }
            }
        }),

        prisma.product.count({
            where: { status: 'PUBLISHED' },
        }
        ),
        prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: {
                status: {
                    in: [
                        OrderStatus.PAID,
                        OrderStatus.PROCESSING,
                        OrderStatus.SHIPPED,
                        OrderStatus.DELIVERED,
                    ]
                }
            }
        }),

        prisma.order.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                orderNumber: true,
                status: true,
                totalAmount: true,
                createdAt: true,
            }
        }),

        prisma.order.groupBy({
            by: ['status'],
            _count: { status: true },
        })

    ])
    return {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        todayOrders,
        totalProducts,
        totalRevenue: Number(revenueResult._sum.totalAmount ?? 0),
        recentActivity,
        orderStatusDistribution: statusDistribution.map((s) => ({
            status: s.status,
            count: s._count.status,
        })),
    }
}