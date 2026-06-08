import { Request, Response, NextFunction } from 'express';
import * as collectionService from '../services/collectionService';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';

export async function getAllCollections(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const collections = await collectionService.findAllCollections();
    sendSuccess(res, collections, 'Collections retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export async function getCollectionById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    if (!id) throw new AppError('Invalid collection ID', 400);

    const collection = await collectionService.findCollectionById(id);
    if (!collection) throw new AppError('Collection not found', 404);

    sendSuccess(res, collection, 'Collection retrieved successfully');
  } catch (error) {
    next(error);
  }
}
export async function getCollectionBySlug(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const slug = req.params['slug'] as string;
    if (!slug) throw new AppError('Invalid collection slug', 400);

    const collection = await collectionService.findCollectionBySlug(slug);
    if (!collection) throw new AppError('Collection not found', 404);

    sendSuccess(res, collection, 'Collection retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export async function createCollection(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { nameAr, nameEn, slug, productIds } = req.body as {
      nameAr: string;
      nameEn: string;
      slug: string;
      productIds?: string[];
    };

    if (!nameAr || !nameEn ||  !slug) {
      throw new AppError('Collection name and slug are required', 400);
    }

    const collection = await collectionService.createCollection({
      nameAr,
      nameEn,
      slug,
      productIds,
    });

    sendSuccess(res, collection, 'Collection created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateCollection(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    if (!id) throw new AppError('Invalid collection ID', 400);

    const {   nameAr, nameEn, slug, productIds } = req.body as {
      nameAr?: string;
      nameEn?: string;
      slug?: string;
      productIds?: string[];
    };

    if (nameAr === undefined && nameEn === undefined && slug === undefined) {
      throw new AppError('At least one field is required for update', 400);
    }

    const collection = await collectionService.updateCollection(id, {
      nameAr,
      nameEn,
      slug,
      productIds,
    });

    sendSuccess(res, collection, 'Collection updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteCollection(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    if (!id) throw new AppError('Invalid collection ID', 400);

    await collectionService.deleteCollection(id);
    sendSuccess(res, null, 'Collection deleted successfully');
  } catch (error) {
    next(error);
  }
}