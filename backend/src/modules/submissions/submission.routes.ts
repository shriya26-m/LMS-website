import { Router } from 'express';
import { submit, getSubmissionsByAssignment, getMySubmissions, gradeSubmission, getInstructorSubmissions } from './submission.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';

const router = Router();

router.post('/', authenticate, authorize('student'), submit);
router.get('/my', authenticate, authorize('student'), getMySubmissions);
router.get('/instructor', authenticate, authorize('instructor', 'admin'), getInstructorSubmissions);
router.get('/assignment/:assignmentId', authenticate, authorize('instructor', 'admin'), getSubmissionsByAssignment);
router.patch('/:id/grade', authenticate, authorize('instructor', 'admin'), gradeSubmission);

export default router;
