import { Certificate } from './certificate.model';
import { ApiError } from '../../utils/ApiError';

export class CertificateService {
    async getStudentCertificates(studentId: string) {
        return Certificate.find({ studentId })
            .populate('courseId', 'title thumbnail instructorId')
            .sort({ issueDate: -1 });
    }

    async getCertificate(studentId: string, courseId: string) {
        const cert = await Certificate.findOne({ studentId, courseId })
            .populate('courseId', 'title thumbnail')
            .populate('studentId', 'name email');
        if (!cert) throw new ApiError(404, 'Certificate not found');
        return cert;
    }
}
