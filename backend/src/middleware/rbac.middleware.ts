import { Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from './auth.middleware';

export type UserRole = 'admin' | 'instructor' | 'student';

export const authorize = (...roles: UserRole[]) => {
    return (req: AuthRequest, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(new ApiError(401, 'Not authenticated'));
            return;
        }

        if (!roles.includes(req.user.role as UserRole)) {
            next(
                new ApiError(
                    403,
                    `Access forbidden. Required roles: ${roles.join(', ')}`
                )
            );
            return;
        }

        next();
    };
};
