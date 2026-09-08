import { Request, Response } from 'express';
import { AuthService, registerSchema, loginSchema } from './auth.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncWrapper } from '../../utils/asyncWrapper';

const authService = new AuthService();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Test User
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: TestPassword123
 *               role:
 *                 type: string
 *                 enum: [student, instructor]
 *                 example: student
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already registered
 */
export const register = asyncWrapper(async (req: Request, res: Response) => {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);

    res.status(201).json(
        new ApiResponse(201, 'Registration successful', result)
    );
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: TestPassword123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
export const login = asyncWrapper(async (req: Request, res: Response) => {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);

    res.json(
        new ApiResponse(200, 'Login successful', result)
    );
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your-refresh-token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
export const refresh = asyncWrapper(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refresh(refreshToken);

    res.json(
        new ApiResponse(200, 'Token refreshed', tokens)
    );
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout and invalidate refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Access token is required or invalid
 */
export const logout = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        await authService.logout(req.user!.id);

        res.json(
            new ApiResponse(200, 'Logged out successfully')
        );
    }
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Access token is required or invalid
 */
export const getMe = asyncWrapper(
    async (req: AuthRequest, res: Response) => {
        const { id, email, role } = req.user!;

        res.json(
            new ApiResponse(200, 'Current user', {
                id,
                email,
                role,
            })
        );
    }
);