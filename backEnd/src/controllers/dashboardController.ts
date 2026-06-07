import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboardService';
import { sendSuccess } from '../utils/response';

export async function getDashboardData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const data = await dashboardService.getDashboardStats();
        sendSuccess(res, data, 'Dashboard data retrieved successfully');
    } catch (error) {
        next(error);
    }
}