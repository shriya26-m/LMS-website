import api from './api';
import type { ApiResponse, Assignment, Submission } from '../types';

export const assignmentsService = {
    getByCourse: (courseId: string) =>
        api.get<ApiResponse<Assignment[]>>(`/assignments/course/${courseId}`),

    create: (data: Partial<Assignment>) =>
        api.post<ApiResponse<Assignment>>('/assignments', data),

    update: (id: string, data: Partial<Assignment>) =>
        api.patch<ApiResponse<Assignment>>(`/assignments/${id}`, data),

    delete: (id: string) =>
        api.delete(`/assignments/${id}`),
};

export const submissionsService = {
    submit: (data: { assignmentId: string; textContent?: string; fileUrl?: string }) =>
        api.post<ApiResponse<Submission>>('/submissions', data),

    getByAssignment: (assignmentId: string) =>
        api.get<ApiResponse<Submission[]>>(`/submissions/assignment/${assignmentId}`),

    getMySubmissions: () =>
        api.get<ApiResponse<Submission[]>>('/submissions/my'),

    getInstructorSubmissions: () =>
        api.get<ApiResponse<Submission[]>>('/submissions/instructor'),

    grade: (id: string, data: { grade: number; feedback?: string }) =>
        api.patch<ApiResponse<Submission>>(`/submissions/${id}/grade`, data),
};
