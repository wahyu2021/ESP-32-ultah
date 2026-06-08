import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import messageRoutes from './routes/messageRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';

const app: Express = express();

// Middleware - Security
app.use(helmet());

// Middleware - CORS
app.use(cors());

// Middleware - Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware - Logging
app.use(morgan('dev'));

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'IoT Smart Frame API is running' });
});

// API Routes
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/device', deviceRoutes);

// Middleware - 404 Not Found
app.use(notFoundHandler);

// Middleware - Global Error Handler
app.use(errorHandler);

export default app;
