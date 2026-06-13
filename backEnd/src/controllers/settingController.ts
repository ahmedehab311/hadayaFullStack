import { Request, Response, NextFunction } from 'express';
import * as settingService from '../services/settingService';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';
import { SettingCategory } from '@prisma/client';

export async function getAllSettings(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Admins see private settings too
        const isAdmin = req.user?.role === 'ADMIN';
        const data = await settingService.getAllSettings(!isAdmin);
        sendSuccess(res, data, "settings retrieved successfully");
    } catch (error) {
        next(error);
    }
}
export async function getPublicSettings(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {

        const data = await settingService.getAllSettings(true);
        sendSuccess(res, data, "settings retrieved successfully");
    } catch (error) {
        next(error);
    }
}
export async function getSettingsByCategory(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { category } = req.params as { category: string };
        const upperCategory = category.toUpperCase() as SettingCategory;
        const validCategories = Object.values(SettingCategory);
        if (!validCategories.includes(upperCategory)) {
            throw new AppError(`Invalid category: ${category}`, 400);
        }

        const isAdmin = req.user?.role === 'ADMIN';

        const data = await settingService.getSettingsByCategory(upperCategory, !isAdmin);
        sendSuccess(res, data, "settings retrieved successfully");
    } catch (error) {
        next(error);
    }
}

export async function upsertSetting(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { key, value, type, category, isPublic } = req.body as {
            key: string;
            value: string;
            type?: string;
            category?: string;
            isPublic?: boolean;
        };

        if (!key || value === undefined || value === null) {
            throw new AppError('key , value required', 400);
        }

        const setting = await settingService.upsertSetting({
            key,
            value: String(value),
            type: type as settingService.UpsertSettingInput['type'],
            category: category as settingService.UpsertSettingInput['category'],
            isPublic,
        });

        sendSuccess(res, setting, 'setting upserted successfully');
    } catch (error) {
        next(error);
    }
}
export async function bulkUpsertSettings(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { settings } = req.body as {
            settings: settingService.BulkUpsertInput;
        };

        if (!Array.isArray(settings) || settings.length === 0) {
            throw new AppError("settings required", 400);
        }

        await settingService.bulkUpsertSettings(settings);
        sendSuccess(res, null, 'settings upserted successfully');
    } catch (error) {
        next(error);
    }
}

export async function deleteSetting(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { key } = req.params as { key: string };
        if (!key) throw new AppError('key required', 400);

        await settingService.deleteSettingByKey(key);
        sendSuccess(res, null, 'setting deleted successfully');
    } catch (error) {
        next(error);
    }
}