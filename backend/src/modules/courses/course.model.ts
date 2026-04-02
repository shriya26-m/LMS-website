import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    thumbnail?: string;
    instructorId: mongoose.Types.ObjectId;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    price: number;
    isPublished: boolean;
    enrolledStudents: mongoose.Types.ObjectId[];
    totalLessons: number;
    rating: number;
    ratingCount: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        thumbnail: { type: String },
        instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        category: { type: String, required: true },
        level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
        price: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: false },
        enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        totalLessons: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        ratingCount: { type: Number, default: 0 },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

CourseSchema.index({ title: 'text', description: 'text', category: 'text' });
CourseSchema.index({ instructorId: 1 });
CourseSchema.index({ isPublished: 1 });

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
