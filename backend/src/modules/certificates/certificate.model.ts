import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
    _id: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    certificateCode: string;
    issueDate: Date;
    certificateUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        certificateCode: { type: String, unique: true },
        issueDate: { type: Date, default: Date.now },
        certificateUrl: { type: String },
    },
    { timestamps: true }
);

CertificateSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export const Certificate = mongoose.model<ICertificate>('Certificate', CertificateSchema);
