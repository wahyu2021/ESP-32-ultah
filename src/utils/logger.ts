import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize } = winston.format;

// Format log kustom
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Output ke konsol (berwarna)
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
    // Simpan semua error ke error.log
    new winston.transports.File({ filename: path.join('logs', 'error.log'), level: 'error' }),
    // Simpan log telemetri/info ke combined.log
    new winston.transports.File({ filename: path.join('logs', 'combined.log') }),
  ],
});

// Catat telemetri khusus ke file terpisah (opsional, jika diperlukan analisa)
export const telemetryLogger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join('logs', 'telemetry.log') }),
  ],
});
