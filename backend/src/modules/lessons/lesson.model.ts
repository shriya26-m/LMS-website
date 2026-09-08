import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
    _id: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    videoUrl?: string;
    pdfUrl?: string;
    duration?: number; // in minutes
    order: number;
    isFree: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
    {
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String },
        videoUrl: { type: String },
        pdfUrl: { type: String },
        duration: { type: Number },
        order: { type: Number, required: true, default: 0 },
        isFree: { type: Boolean, default: false },
    },
    { timestamps: true }
);

LessonSchema.index({ courseId: 1, order: 1 });

export const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema);
