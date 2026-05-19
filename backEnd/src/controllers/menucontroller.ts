import { Request, Response, NextFunction } from 'express';
import * as menuService from '../services/menuService';
import { sendSuccess } from '../utils/response';

export async function getMenu(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const menu = await menuService.getMenu();
        sendSuccess(res, menu, 'Menu retrieved successfully');
    } catch (error) {
        next(error);
    }

}