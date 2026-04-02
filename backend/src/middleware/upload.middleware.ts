import multer from 'multer';
import { storage } from '../config/cloudinary';
import { ApiError } from '../utils/ApiError';

const fileFilter = (
    _req: any,
    file: any,
    cb: any
) => {
    const allowedTypes = [
        'video/mp4',
        'video/webm',
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp',
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'Invalid file type'), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
});

