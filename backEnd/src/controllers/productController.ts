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
    const { name, description, price, stock, imageUrl } = req.body as {
      name: string;
      description?: string;
      price: number;
      stock?: number;
      imageUrl?: string;
    };

    if (!name || price === undefined || price === null) {
      throw new AppError('Product name and price are required', 400);
    }

    if (typeof price !== 'number' || price < 0) {
      throw new AppError('Price must be a positive number', 400);
    }

    const product = await productService.createProduct({
      name,
      description,
      price,
      stock,
      imageUrl,
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

    const { name, description, price, stock, imageUrl } = req.body as {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      imageUrl?: string;
    };

    if (
      name === undefined &&
      description === undefined &&
      price === undefined &&
      stock === undefined &&
      imageUrl === undefined
    ) {
      throw new AppError('At least one field is required for update', 400);
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      throw new AppError('Price must be a positive number', 400);
    }

    const product = await productService.updateProduct(id, {
      name,
      description,
      price,
      stock,
      imageUrl,
    });

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