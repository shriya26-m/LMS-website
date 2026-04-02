import { Request, Response } from 'express';
import { UserService } from './user.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncWrapper } from '../../utils/asyncWrapper';

const userService = new UserService();

export const getAllUsers = asyncWrapper(async (req: Request, res: Response) => {
    const { page = '1', limit = '10', role } = req.query as Record<string, string>;
    const result = await userService.getAllUsers(Number(page), Number(limit), role);
    res.json(new ApiResponse(200, 'Users retrieved', result));
});

export const getUserById = asyncWrapper(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id);
    res.json(new ApiResponse(200, 'User retrieved', user));
});

export const updateUser = asyncWrapper(async (req: Request, res: Response) => {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(new ApiResponse(200, 'User updated', user));
});

export const deleteUser = asyncWrapper(async (req: Request, res: Response) => {
    await userService.deleteUser(req.params.id);
    res.json(new ApiResponse(200, 'User deleted'));
});

export const getUserStats = asyncWrapper(async (_req: Request, res: Response) => {
    const stats = await userService.getStats();
    res.json(new ApiResponse(200, 'User stats', stats));
});
