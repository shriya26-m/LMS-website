import api from './api';
import type { ApiResponse, Course, PaginatedResponse } from '../types';

export const coursesService = {
    getAll: (page = 1, limit = 10, search?: string, category?: string, level?: string) =>
        api.get<ApiResponse<PaginatedResponse<Course>>>('/courses', { params: { page, limit, search, category, level } }),

    getMyCourses: (page = 1) =>
        api.get<ApiResponse<PaginatedResponse<Course>>>('/courses/my-courses', { params: { page } }),

    getById: (id: string) =>
        api.get<ApiResponse<Course>>(`/courses/${id}`),

    create: (data: Partial<Course>) =>
        api.post<ApiResponse<Course>>('/courses', data),

    update: (id: string, data: Partial<Course>) =>
        api.patch<ApiResponse<Course>>(`/courses/${id}`, data),

    delete: (id: string) =>
        api.delete(`/courses/${id}`),

    publish: (id: string) =>
        api.patch<ApiResponse<Course>>(`/courses/${id}/publish`),

    enroll: (id: string) =>
        api.post(`/courses/${id}/enroll`),

    getCategories: () =>
        api.get<ApiResponse<string[]>>('/courses/categories'),

    getStats: () =>
        api.get<ApiResponse<{ totalCourses: number; publishedCourses: number; totalEnrollments: number }>>('/courses/stats'),
};
