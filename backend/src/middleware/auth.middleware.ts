import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt.util';
import { ApiError } from '../utils/ApiError';

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const authenticate = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Access token is required');
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(401, 'Invalid or expired access token'));
        }
    }
};
