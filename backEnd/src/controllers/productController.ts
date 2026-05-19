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

    // التحقق من الحقول الإلزامية بناءً على السكيما الجديدة
    if (!slug || !nameAr || !nameEn || price === undefined || price === null) {
      throw new AppError('Slug, Arabic Name, English Name, and Price are required', 400);
    }

    // التحقق من أن السعر رقم موجب (أو سترينج يمثل رقم)
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

    await productService.deleteProduct(id);
    sendSuccess(res, null, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
}