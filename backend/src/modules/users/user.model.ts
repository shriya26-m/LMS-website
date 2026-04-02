import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'admin' | 'instructor' | 'student';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    avatar?: string;
    bio?: string;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: ['admin', 'instructor', 'student'], default: 'student' },
        status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
        avatar: { type: String },
        bio: { type: String },
        refreshToken: { type: String, select: false },
    },
    { timestamps: true }
);

UserSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
