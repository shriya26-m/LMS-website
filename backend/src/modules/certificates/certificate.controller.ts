import { Response } from 'express';
import { CertificateService } from './certificate.service';
import { AuthRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncWrapper } from '../../utils/asyncWrapper';

const certService = new CertificateService();

export const getMyCertificates = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const certs = await certService.getStudentCertificates(req.user!.id);
    res.json(new ApiResponse(200, 'Certificates retrieved', certs));
});

export const getCertificate = asyncWrapper(async (req: AuthRequest, res: Response) => {
    const cert = await certService.getCertificate(req.user!.id, req.params.courseId);
    res.json(new ApiResponse(200, 'Certificate retrieved', cert));
});
