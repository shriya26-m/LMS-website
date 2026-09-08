import { Router } from 'express';
import { createAssignment, getAssignmentsByCourse, getAssignmentById, updateAssignment, deleteAssignment } from './assignment.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';

const router = Router();

router.get('/course/:courseId', authenticate, getAssignmentsByCourse);
router.get('/:id', authenticate, getAssignmentById);
router.post('/', authenticate, authorize('instructor', 'admin'), createAssignment);
router.patch('/:id', authenticate, authorize('instructor', 'admin'), updateAssignment);
router.delete('/:id', authenticate, authorize('instructor', 'admin'), deleteAssignment);

export default router;
