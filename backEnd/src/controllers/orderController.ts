import { Request, Response, NextFunction } from 'express';
import * as orderService from '../services/orderService';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import { DeliveryType, PaymentMethod } from '@prisma/client';

export async function createOrder(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {

    try {
        const buyerId = req.user?.id;
        if (!buyerId) {
            throw new AppError('Unauthorized: User information not found', 401);
        }

        const {
            deliveryType,
            paymentMethod,
            items,
            buyerAddressId,
            recipientName,
            recipientPhone,
            recipientEmail
        } = req.body as {
            deliveryType: DeliveryType;
            paymentMethod: PaymentMethod;
            items: orderService.OrderItemInput[],
            buyerAddressId?: string;
            recipientName?: string;
            recipientPhone?: string;
            recipientEmail?: string;
        }

        if (!deliveryType || !paymentMethod || !items?.length) {
            throw new AppError('Missing required fields: deliveryType, paymentMethod, and items are required.', 400);
        }
        const order = await orderService.createOrder(buyerId, {
            deliveryType,
            paymentMethod,
            items,
            buyerAddressId,
            recipientName,
            recipientPhone,
            recipientEmail,
        })

        sendSuccess(res, order, 'Order created successfully', 201);
    } catch (error) {
        next(error);
    }

}
export async function getMyOrders(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {

    try {
        const buyerId = req.user?.id;
        if (!buyerId) {
            throw new AppError('Unauthorized: User information not found', 401);
        }
        const orders = await orderService.findMyOrders(buyerId);
        sendSuccess(res, orders, 'Orders retrieved successfully');
    } catch (error) {
        next(error);
    }

}
export async function getOrderById(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {

    try {
        const buyerId = req.user?.id;
        if (!buyerId) {
            throw new AppError('Unauthorized: User information not found', 401);
        }
        const id = req.params['id'] as string;
        const order = await orderService.findOrderById(id, buyerId);

        sendSuccess(res, order, 'Order retrieved successfully');
    } catch (error) {
        next(error);
    }

}
export async function cancelOrder(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {

    try {
        const buyerId = req.user?.id;
        if (!buyerId) {
            throw new AppError('Unauthorized: User information not found', 401);
        }
        const id = req.params['id'] as string;

        const order = await orderService.cancelOrder(id, buyerId);

        sendSuccess(res, order, 'Order canceled successfully');
    } catch (error) {
        next(error);
    }
}
export async function uploadPaymentProof(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {

    try {
        const buyerId = req.user?.id;
        if (!buyerId) {
            throw new AppError('Unauthorized: User information not found', 401);
        }
        const id = req.params['id'] as string;

        const { imgUrl, method } = req.body as { imgUrl: string, method: PaymentMethod };

        if (!imgUrl || !method) {
            throw new AppError('Missing required fields: imgUrl and method are required.', 400);
        }

        const proof = await orderService.addPaymentProof(id, buyerId, imgUrl, method);

        sendSuccess(res, proof, 'Payment proof uploaded successfully');
    } catch (error) {
        next(error);
    }
}
