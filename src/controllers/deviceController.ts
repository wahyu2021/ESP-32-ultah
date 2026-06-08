import type { Request, Response, NextFunction } from 'express';
import { messageRepository } from '../services/messageRepository.js';
import { telemetryLogger } from '../utils/logger.js';

export const handleDevicePoll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pendingMessage = await messageRepository.getLatestPendingMessage();

    if (!pendingMessage) {
      return res.status(200).json({ has_update: false });
    }

    // Ubah status menjadi delivered karena sudah di-pull oleh device
    await messageRepository.markAsDelivered(pendingMessage.id);

    // Format response sesuai PRD
    if (pendingMessage.type === 'text') {
      return res.status(200).json({
        has_update: true,
        message_id: pendingMessage.id,
        type: 'text',
        payload: {
          text: pendingMessage.text_content,
          timestamp: pendingMessage.created_at.toISOString(),
        },
      });
    }

    if (pendingMessage.type === 'image') {
      // Parse kembali stringified JSON ke array native
      const hexBlack = pendingMessage.hex_black_array ? JSON.parse(pendingMessage.hex_black_array) : [];
      const hexRed = pendingMessage.hex_red_array ? JSON.parse(pendingMessage.hex_red_array) : [];

      return res.status(200).json({
        has_update: true,
        message_id: pendingMessage.id,
        type: 'image',
        payload: {
          width: 250, // Hardcoded sesuai PRD resolusi fisik E-Paper
          height: 122,
          hex_black: hexBlack,
          hex_red: hexRed,
          timestamp: pendingMessage.created_at.toISOString(),
        },
      });
    }

    // Jika tipe tidak dikenali (fallback keamanan)
    return res.status(200).json({ has_update: false });

  } catch (error) {
    next(error);
  }
};

export const handleDeviceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const telemetryData = req.body;
    
    // Log data telemetri ke file khusus
    telemetryLogger.info('Device Telemetry Received', { 
      ip: req.ip,
      ...telemetryData 
    });

    return res.status(200).json({
      success: true,
      message: 'Telemetry logged successfully'
    });
  } catch (error) {
    next(error);
  }
};
