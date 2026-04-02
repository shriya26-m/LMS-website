import { Router } from 'express';
import { getMyCertificates, getCertificate } from './certificate.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';

const router = Router();

router.use(authenticate, authorize('student'));

router.get('/my', getMyCertificates);
router.get('/course/:courseId', getCertificate);

export default router;
