import { Router } from 'express';
import multer from 'multer';
import { handleIncomingText, handleIncomingImage } from '../controllers/messageController.js';
import { requireApiKey } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { textMessageSchema } from '../utils/validators.js';

const router = Router();

// Setup Multer untuk menyimpan file di memory (buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
});

// Middleware auth untuk semua route di bawah ini
router.use(requireApiKey);

// Endpoint POST /api/v1/messages/text
router.post('/text', validateRequest(textMessageSchema), handleIncomingText);

// Endpoint POST /api/v1/messages/image
router.post('/image', upload.single('image'), handleIncomingImage);

export default router;
