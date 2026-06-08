import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  apiKey: process.env.API_KEY || 'secret_token_key',
  deviceKey: process.env.DEVICE_KEY || 'device_secret_token',
  nodeEnv: process.env.NODE_ENV || 'development',
};
