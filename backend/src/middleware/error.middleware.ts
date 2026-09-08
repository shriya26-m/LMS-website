import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../config/logger';

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof ApiError) {
        res
            .status(err.statusCode)
            .json(new ApiResponse(err.statusCode, err.message, { errors: err.errors }));
        return;
    }

    if (err instanceof ZodError) {
        const errors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        res.status(400).json(new ApiResponse(400, 'Validation failed', { errors }));
        return;
    }

    logger.error('Unhandled error:', err);

    res.status(500).json(new ApiResponse(500, 'Internal server error', { error: process.env.NODE_ENV === 'development' ? err : undefined }));
};
