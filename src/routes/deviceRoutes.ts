import { Router } from 'express';
import { handleDevicePoll, handleDeviceStatus } from '../controllers/deviceController.js';
import { requireDeviceKey } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { telemetrySchema } from '../utils/validators.js';

const router = Router();

// Endpoint khusus device, semua butuh Device API Key
router.use(requireDeviceKey);

// Endpoint polling 
router.get('/poll', handleDevicePoll);

// Endpoint telemetri
router.post('/status', validateRequest(telemetrySchema), handleDeviceStatus);

export default router;
