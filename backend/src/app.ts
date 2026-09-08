import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

// import { globalRateLimiter } from './middleware/rateLimiter.middleware';
import { errorHandler } from './middleware/error.middleware';
import { swaggerSpec } from './config/swagger';
import { logger } from './config/logger';
import { env } from './config/env';

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import courseRoutes from './modules/courses/course.routes';
import lessonRoutes from './modules/lessons/lesson.routes';
import assignmentRoutes from './modules/assignments/assignment.routes';
import submissionRoutes from './modules/submissions/submission.routes';
import progressRoutes from './modules/progress/progress.routes';
import certificateRoutes from './modules/certificates/certificate.routes';
import uploadRoutes from './modules/uploads/upload.routes';

const app = express();

// Security
app.use(helmet());
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
}));
// app.use(globalRateLimiter);
app.use(compression() as express.RequestHandler);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
});

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/courses`, courseRoutes);
app.use(`${API_PREFIX}/lessons`, lessonRoutes);
app.use(`${API_PREFIX}/assignments`, assignmentRoutes);
app.use(`${API_PREFIX}/submissions`, submissionRoutes);
app.use(`${API_PREFIX}/progress`, progressRoutes);
app.use(`${API_PREFIX}/certificates`, certificateRoutes);
app.use(`${API_PREFIX}/uploads`, uploadRoutes);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

export default app;
