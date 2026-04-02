import { Router } from 'express';
import { createLesson, getLessonsByCourse, getLessonById, updateLesson, deleteLesson, reorderLessons } from './lesson.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';

const router = Router();

router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', authenticate, getLessonById);
router.post('/', authenticate, authorize('instructor', 'admin'), createLesson);
router.put('/course/:courseId/reorder', authenticate, authorize('instructor', 'admin'), reorderLessons);
router.patch('/:id', authenticate, authorize('instructor', 'admin'), updateLesson);
router.delete('/:id', authenticate, authorize('instructor', 'admin'), deleteLesson);

export default router;
