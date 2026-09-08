import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { ApiError } from '../../utils/ApiError';

export const uploadSingle = asyncWrapper(async (req: AuthRequest, res: Response) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded');

    const file = req.file as any;
    res.json(new ApiResponse(200, 'File uploaded', {
        url: file.path || file.secure_url,
        publicId: file.filename || file.public_id,
        bytes: file.size,
        format: file.mimetype.split('/')[1]
    }));
});
