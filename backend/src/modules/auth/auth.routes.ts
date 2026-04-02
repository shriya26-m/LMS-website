import { Router } from 'express';
import { register, login, refresh, logout, getMe } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authRateLimiter } from '../../middleware/rateLimiter.middleware';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
