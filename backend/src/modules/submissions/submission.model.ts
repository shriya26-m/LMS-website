import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
    _id: mongoose.Types.ObjectId;
    assignmentId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    fileUrl?: string;
    textContent?: string;
    grade?: number;
    feedback?: string;
    status: 'submitted' | 'graded';
    submittedAt: Date;
    gradedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
    {
        assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        fileUrl: { type: String },
        textContent: { type: String },
        grade: { type: Number, min: 0 },
        feedback: { type: String },
        status: { type: String, enum: ['submitted', 'graded'], default: 'submitted' },
        submittedAt: { type: Date, default: Date.now },
        gradedAt: { type: Date },
    },
    { timestamps: true }
);

SubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

export const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);
