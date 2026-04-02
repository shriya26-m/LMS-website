import api from './api';
import type { ApiResponse, User, PaginatedResponse } from '../types';

export const usersService = {
    getAll: (page = 1, role?: string) =>
        api.get<ApiResponse<PaginatedResponse<User>>>('/users', { params: { page, role } }),

    getById: (id: string) =>
        api.get<ApiResponse<User>>(`/users/${id}`),

    update: (id: string, data: Partial<User>) =>
        api.patch<ApiResponse<User>>(`/users/${id}`, data),

    delete: (id: string) =>
        api.delete(`/users/${id}`),

    getStats: () =>
        api.get<ApiResponse<{ totalUsers: number; students: number; instructors: number; admins: number }>>('/users/stats'),
};
