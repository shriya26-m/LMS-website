import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';
import { uploadSingle } from './upload.controller';

const router = Router();

router.post('/single', authenticate, upload.single('file'), uploadSingle);

export default router;
