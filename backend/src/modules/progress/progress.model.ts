import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
    _id: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    completedLessons: mongoose.Types.ObjectId[];
    progressPercent: number;
    isCompleted: boolean;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
        progressPercent: { type: Number, default: 0, min: 0, max: 100 },
        isCompleted: { type: Boolean, default: false },
        completedAt: { type: Date },
    },
    { timestamps: true }
);

ProgressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export const Progress = mongoose.model<IProgress>('Progress', ProgressSchema);
