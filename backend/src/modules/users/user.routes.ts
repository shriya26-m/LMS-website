import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, getUserStats } from './user.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';

const router = Router();

router.use(authenticate);

router.get('/stats', authorize('admin'), getUserStats);
router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
