import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/productService';
import { sendSuccess } from '../utils/response';
import { AppError } from '../utils/AppError';

export async function getAllProducts(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const products = await productService.findAllProducts();
    sendSuccess(res, products, 'Products retrieved successfully');
  } catch (error) {
    next(error);
  }
}

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;

    if (!id) throw new AppError('Invalid product ID', 400);

    const product = await productService.findProductById(id);
    if (!product) throw new AppError('Product not found', 404);

    sendSuccess(res, product, 'Product retrieved successfully');
  } catch (error) {
    next(error);
  }
}
export async function getProductBySlug(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const slug = req.params['slug'] as string;
    if (!slug) throw new AppError('Invalid product slug', 400);

    const product = await productService.findProductBySlug(slug);
    if (!product) throw new AppError('Product not found', 404);

    sendSuccess(res, product, 'Product retrieved successfully');
  } catch (error) {
    next(error);
  }
}
export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      slug,
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      price,
      compareAtPrice,
      status,
      stock,
      imageUrl,
      images,
      isPersonalizable,
      giftMessageEnabled,
      attributes,
      isBestSeller,
      metaTitle,
      metaDescription,
    } = req.body;

    if (!slug || !nameAr || !nameEn || price === undefined || price === null) {
      throw new AppError('Slug, Arabic Name, English Name, and Price are required', 400);
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      throw new AppError('Price must be a valid positive number', 400);
    }

    const product = await productService.createProduct({
      slug,
      nameAr,
      nameEn,
      descriptionAr,
      descriptionEn,
      price: parsedPrice,
      compareAtPrice,
      status,
      stock,
      imageUrl,
      images,
      isPersonalizable,
      giftMessageEnabled,
      attributes,
      isBestSeller,
      metaTitle,
      metaDescription,
    });

    sendSuccess(res, product, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;

    if (!id) throw new AppError('Invalid product ID', 400);

    const body = req.body;

    // التأكد من أن الـ Body مش فاضي
    if (Object.keys(body).length === 0) {
      throw new AppError('At least one field is required for update', 400);
    }

    if (body.price !== undefined) {
      const parsedPrice = Number(body.price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        throw new AppError('Price must be a valid positive number', 400);
      }
    }

    const product = await productService.updateProduct(id, body);

    sendSuccess(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;

    if (!id) throw new AppError('Invalid product ID', 400);

    const product = await productService.deleteProduct(id);

    const wasArchived = product.status === 'ARCHIVED';

    const message = wasArchived
      ? 'Product has active orders — archived instead of deleted'
      : 'Product deleted successfully';

    sendSuccess(res, null, message);
  } catch (error) {
    next(error);
  }
}