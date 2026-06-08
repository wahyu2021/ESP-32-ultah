import type { Request, Response, NextFunction } from 'express';
import { responseHandler } from '../utils/responseHandler.js';
import { messageRepository } from '../services/messageRepository.js';
import { processImageToBWR } from '../services/imageProcessor.js';

export const handleIncomingText = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, sender } = req.body;
    
    // Format pesan final jika ada sender
    const textContent = sender ? `${text}\n\n- ${sender}` : text;

    const message = await messageRepository.createMessage({
      type: 'text',
      text_content: textContent,
    });

    return res.status(201).json({
      success: true,
      message_id: message.id,
      status: 'queued',
    });
  } catch (error) {
    next(error);
  }
};

export const handleIncomingImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return responseHandler.error(res, 'No image file provided', 400);
    }

    // Proses gambar dengan Sharp (BWR Dithering)
    const processedImage = await processImageToBWR(req.file.buffer);

    // Simpan array hex sebagai string JSON
    const message = await messageRepository.createMessage({
      type: 'image',
      hex_black_array: JSON.stringify(processedImage.hex_black),
      hex_red_array: JSON.stringify(processedImage.hex_red),
    });

    return res.status(201).json({
      success: true,
      message_id: message.id,
      status: 'processed',
      info: 'Image successfully converted to 250x122 BWR Hex arrays',
    });
  } catch (error) {
    console.error('[IMAGE_PROCESSING_ERROR]', error);
    next(error);
  }
};
