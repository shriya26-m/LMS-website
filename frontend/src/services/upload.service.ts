import api from './api';
import type { ApiResponse } from '../types';

export const uploadService = {
    uploadSingle: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post<ApiResponse<{ url: string; publicId: string }>>('/uploads/single', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};
