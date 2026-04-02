import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(env.MONGO_URI);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
 

