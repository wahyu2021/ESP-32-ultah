import type { Request, Response, NextFunction } from 'express';
import { responseHandler } from '../utils/responseHandler.js';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  return responseHandler.error(res, message, statusCode, err);
};

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  return responseHandler.error(res, `Route ${req.originalUrl} not found`, 404);
};
