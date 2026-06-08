import app from './app.js';
import { config } from './config/index.js';

const startServer = () => {
  try {
    app.listen(config.port, () => {
      console.log(`[SERVER] Running in ${config.nodeEnv} mode`);
      console.log(`[SERVER] Listening on port ${config.port}`);
    });
  } catch (error) {
    console.error('[SERVER] Failed to start:', error);
    process.exit(1);
  }
};

startServer();
