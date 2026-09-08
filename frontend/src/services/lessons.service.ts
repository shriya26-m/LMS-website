import api from './api';
import type { ApiResponse, Lesson } from '../types';

export const lessonsService = {
    getByCourse: (courseId: string) =>
        api.get<ApiResponse<Lesson[]>>(`/lessons/course/${courseId}`),

    getById: (id: string) =>
        api.get<ApiResponse<Lesson>>(`/lessons/${id}`),

    create: (data: Partial<Lesson>) =>
        api.post<ApiResponse<Lesson>>('/lessons', data),

    update: (id: string, data: Partial<Lesson>) =>
        api.patch<ApiResponse<Lesson>>(`/lessons/${id}`, data),

    delete: (id: string) =>
        api.delete(`/lessons/${id}`),

    reorder: (courseId: string, orders: { id: string; order: number }[]) =>
        api.put(`/lessons/course/${courseId}/reorder`, { orders }),
};
