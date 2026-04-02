import api from './api';
import type { ApiResponse } from '../types';

export interface LoginData { email: string; password: string; }
export interface RegisterData { name: string; email: string; password: string; role?: string; }

export const authService = {
    register: (data: RegisterData) =>
        api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: { id: string; name: string; email: string; role: string; } }>>('/auth/register', data),

    login: (data: LoginData) =>
        api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: { id: string; name: string; email: string; role: string; } }>>('/auth/login', data),

    refresh: (refreshToken: string) =>
        api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', { refreshToken }),

    logout: () => api.post('/auth/logout'),

    getMe: () => api.get<ApiResponse<{ id: string; email: string; role: string }>>('/auth/me'),
};
