import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { responseHandler } from '../utils/responseHandler.js';

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
            message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        return responseHandler.error(res, 'Validation failed', 400, errorMessages);
      }
      return responseHandler.error(res, 'Internal Server Error', 500, error);
    }
  };
};
