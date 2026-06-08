import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';
import { responseHandler } from '../utils/responseHandler.js';

export const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-API-KEY');

  if (!apiKey) {
    return responseHandler.error(res, 'API Key is missing', 401);
  }

  // Cek apakah itu dari WA Bot (Server) atau dari ESP32 (Device)
  if (apiKey !== config.apiKey && apiKey !== config.deviceKey) {
    return responseHandler.error(res, 'Invalid API Key', 403);
  }

  next();
};

export const requireDeviceKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header('X-API-KEY');
  
    if (!apiKey) {
      return responseHandler.error(res, 'Device API Key is missing', 401);
    }
  
    if (apiKey !== config.deviceKey) {
      return responseHandler.error(res, 'Invalid Device API Key', 403);
    }
  
    next();
  };
