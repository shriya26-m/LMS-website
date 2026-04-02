import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
    _id: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    deadline: Date;
    maxScore: number;
    createdAt: Date;
    updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
    {
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        deadline: { type: Date, required: true },
        maxScore: { type: Number, default: 100 },
    },
    { timestamps: true }
);

AssignmentSchema.index({ courseId: 1 });

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
