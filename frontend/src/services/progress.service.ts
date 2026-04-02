import api from './api';
import type { ApiResponse, Progress, Certificate } from '../types';

export const progressService = {
    getMy: () =>
        api.get<ApiResponse<Progress[]>>('/progress/my'),

    getByCourse: (courseId: string) =>
        api.get<ApiResponse<Progress>>(`/progress/course/${courseId}`),

    markComplete: (courseId: string, lessonId: string) =>
        api.post<ApiResponse<Progress>>('/progress/complete', { courseId, lessonId }),
};

export const certificatesService = {
    getMy: () =>
        api.get<ApiResponse<Certificate[]>>('/certificates/my'),

    getByCourse: (courseId: string) =>
        api.get<ApiResponse<Certificate>>(`/certificates/course/${courseId}`),
};
