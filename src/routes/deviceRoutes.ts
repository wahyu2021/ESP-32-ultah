import { Router } from 'express';
import { handleDevicePoll } from '../controllers/deviceController.js';
import { requireDeviceKey } from '../middlewares/authMiddleware.js';

const router = Router();

// Endpoint polling khusus device
router.get('/poll', requireDeviceKey, handleDevicePoll);

export default router;
