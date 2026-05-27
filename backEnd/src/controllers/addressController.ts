import { Request, Response, NextFunction } from 'express';
import * as addressService from '../services/addressService';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';

export async function getMyAddresses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.user!.id
        const addresses = await addressService.findUserAddresses(userId)

        sendSuccess(res, addresses, 'Addresses retrieved successfully', 200);
    } catch (error) {
        next(error);
    }

}
export async function getAddressById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.user!.id
        const id = req.params['id'] as string
        const address = await addressService.findAddressById(id, userId)

        if (!address) throw new AppError('Address not found', 404)

        sendSuccess(res, address, 'Address retrieved successfully', 200);
    } catch (error) {
        next(error);
    }

}
export async function createAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.user!.id
        const { city, street, phone, label, building, floor, apartment, landmark, postalCode, isDefault } =
            req.body as {
                city: string;
                street: string;
                phone: string;
                label?: string;
                building?: string;
                floor?: string;
                apartment?: string;
                landmark?: string;
                postalCode?: string;
                isDefault?: boolean;
            };
        if (!city || !street || !phone) {
            throw new AppError("City, street, and phone are required", 400);
        }

        const address = await addressService.createAddress(userId, {
            city,
            street,
            phone,
            label,
            building,
            floor,
            apartment,
            landmark,
            postalCode,
            isDefault,
        })

        sendSuccess(res, address, 'Address created successfully', 201);
    } catch (error) {
        next(error);
    }

}
export async function updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.user!.id
        const id = req.params['id'] as string

        const data = req.body as addressService.UpdateAddressInput;
        if (Object.keys(data).length === 0) {
            throw new AppError("At least one field is required to update", 400);
        }

        const address = await addressService.updateAddress(id, userId, data);

        sendSuccess(res, address, 'Address updated successfully', 200);
    } catch (error) {
        next(error);
    }

}
export async function deleteAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.user!.id
        const id = req.params['id'] as string

        await addressService.deleteAddress(id, userId);

        sendSuccess(res, null, 'Address deleted successfully', 200);
    } catch (error) {
        next(error);
    }
}
export async function setDefaultAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.user!.id
        const id = req.params['id'] as string

        await addressService.setDefaultAddress(id, userId);

        sendSuccess(res, null, 'Default address set successfully', 200);
    } catch (error) {
        next(error);
    }
}