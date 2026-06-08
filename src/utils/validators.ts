import { z } from 'zod';

export const textMessageSchema = z.object({
  body: z.object({
    text: z.string({
      message: 'Text is required',
    }).min(1, 'Text cannot be empty').max(200, 'Text too long (max 200 chars)'),
    sender: z.string().optional(),
  }),
});

export const telemetrySchema = z.object({
    body: z.object({
        battery_voltage: z.number().optional(),
        battery_percentage: z.number().min(0).max(100).optional(),
        power_mode: z.enum(['battery', 'usb']).optional(),
        rssi: z.number().optional(),
    })
})
