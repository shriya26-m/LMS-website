import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (_req, file) => {
        const isVideo = file.mimetype.startsWith('video');
        return {
            folder: 'lms-uploads',
            resource_type: isVideo ? 'video' : 'auto',
            allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'mp4', 'mkv'],
        };
    },
});

export default cloudinary;
