import { Router } from 'express';
import {
    createCourse, getAllCourses, getInstructorCourses, getCourseById,
    updateCourse, deleteCourse, publishCourse, enrollStudent,
    getEnrolledStudents, getCategories, getCourseStats
} from './course.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';

const router = Router();

router.get('/categories', getCategories);
router.get('/stats', authenticate, authorize('admin'), getCourseStats);
router.get('/my-courses', authenticate, authorize('instructor'), getInstructorCourses);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

router.post('/', authenticate, authorize('instructor', 'admin'), createCourse);
router.patch('/:id', authenticate, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', authenticate, authorize('instructor', 'admin'), deleteCourse);
router.patch('/:id/publish', authenticate, authorize('instructor', 'admin'), publishCourse);
router.post('/:id/enroll', authenticate, authorize('student'), enrollStudent);
router.get('/:id/students', authenticate, authorize('instructor', 'admin'), getEnrolledStudents);

export default router;
