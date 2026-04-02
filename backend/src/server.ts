import 'dotenv/config';
import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { logger } from './config/logger';
import fs from 'fs';

// Ensure required directories exist
['logs', 'uploads'].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const startServer = async () => {
    await connectDB();

    const server = app.listen(env.PORT, () => {
        logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
        logger.info(`📚 API Docs: http://localhost:${env.PORT}/api-docs`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        logger.info('SIGTERM received. Closing HTTP server...');
        server.close(() => {
            logger.info('HTTP server closed');
            process.exit(0);
        });
    });

    process.on('unhandledRejection', (reason: Error) => {
        logger.error('Unhandled Rejection:', reason);
        server.close(() => process.exit(1));
    });
};

startServer();
