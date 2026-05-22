import prisma from '../config/prismaClient';
import { Setting, Prisma, SettingCategory } from '@prisma/client';
import { AppError } from '../utils/AppError';

export type SettingValue = string | number | boolean | Record<string, unknown>;
export type GroupedSettings = {
    [category: string]: Record<string, SettingValue>;
};
export type UpsertSettingInput = {
    key: string;
    value: string;
    type?: Setting['type'];
    category?: Setting['category'];
    isPublic?: boolean;
};

function parseValue(setting: Setting): SettingValue {
    switch (setting.type) {
        case 'NUMBER':
            return Number(setting.value);
        case 'BOOLEAN':
            return setting.value === 'true';
        case 'JSON':
            try {
                return JSON.parse(setting.value) as Record<string, unknown>;
            } catch {
                throw new AppError(`Invalid JSON for setting key: ${setting.key}`, 500);
            }
        default:
            return setting.value;
    }
}

function groupSettings(settings: Setting[]): GroupedSettings {
    return settings.reduce<GroupedSettings>((acc, setting) => {
        const category = setting.category.toLowerCase();
        if (!acc[category]) acc[category] = {};

        const fieldName = setting.key.includes('.')
            ? setting.key.split('.').slice(1).join('.')
            : setting.key;

        acc[category][fieldName] = parseValue(setting);
        return acc;
    }, {});
}

export async function getAllSettings(onlyPublic = true): Promise<GroupedSettings> {
    const settings = await prisma.setting.findMany({
        where: onlyPublic ? { isPublic: true } : undefined,
        orderBy: { category: 'asc' },
    })
    return groupSettings(settings);
}

export async function getSettingsByCategory(category: SettingCategory, onlyPublic = true): Promise<Record<string, SettingValue>> {
    const settings = await prisma.setting.findMany({
        where: { category, ...(onlyPublic ? { isPublic: true } : {}), }
    })
    const grouped = groupSettings(settings);
    return grouped[category.toLowerCase()] ?? {};
}
export async function getSettingByKey(key: string): Promise<SettingValue> {
    const setting = await prisma.setting.findUnique({ where: { key } })
    if (!setting) throw new AppError(`Setting not found: ${key}`, 404);
    return parseValue(setting);
}
export async function upsertSetting(data: UpsertSettingInput): Promise<Setting> {
    return prisma.setting.upsert({
        where: { key: data.key },
        update: {
            value: data.value,
            ...(data.type && { type: data.type }),
            ...(data.category && { category: data.category }),
            ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
        },
        create: {
            key: data.key,
            value: data.value,
            type: data.type ?? 'STRING',
            category: data.category ?? 'GENERAL',
            isPublic: data.isPublic ?? true,
        },
    })
}

export type BulkUpsertInput = UpsertSettingInput[];
export async function bulkUpsertSettings(items: BulkUpsertInput): Promise<void> {
    await prisma.$transaction(
        items.map((item) =>
            prisma.setting.upsert({
                where: { key: item.key },
                update: {
                    value: item.value,
                    ...(item.type && { type: item.type }),
                    ...(item.category && { category: item.category }),
                    ...(item.isPublic !== undefined && { isPublic: item.isPublic }),
                },
                create: {
                    key: item.key,
                    value: item.value,
                    type: item.type ?? 'STRING',
                    category: item.category ?? 'GENERAL',
                    isPublic: item.isPublic ?? true,
                },
            })
        )
    );
}

export async function deleteSettingByKey(key: string): Promise<Setting> {
    try {
        return await prisma.setting.delete({ where: { key } });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            throw new AppError(`Setting not found: ${key}`, 404);
        }
        throw error;
    }
}