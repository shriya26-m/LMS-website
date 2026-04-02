import { Router } from 'express';
import { getProgress, getMyProgress, markLessonComplete } from './progress.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';

const router = Router();

router.use(authenticate, authorize('student'));

router.get('/my', getMyProgress);
router.get('/course/:courseId', getProgress);
router.post('/complete', markLessonComplete);

export default router;
