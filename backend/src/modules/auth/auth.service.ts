import { User, IUser } from '../users/user.model';
import { hashPassword, comparePassword } from '../../utils/password.util';
import { signAccessToken, signRefreshToken, verifyRefreshToken, JwtPayload } from '../../utils/jwt.util';
import { ApiError } from '../../utils/ApiError';
import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['student', 'instructor']).default('student'),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export class AuthService {
    async register(data: z.infer<typeof registerSchema>) {
        const existing = await User.findOne({ email: data.email });
        if (existing) throw new ApiError(409, 'Email is already registered');

        const hashedPassword = await hashPassword(data.password);
        const user = await User.create({ ...data, password: hashedPassword });

        const payload: JwtPayload = {
            id: user._id.toString(),
            role: user.role,
            email: user.email,
        };

        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();

        return {
            accessToken,
            refreshToken,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        };
    }

    async login(data: z.infer<typeof loginSchema>) {
        const user = await User.findOne({ email: data.email }).select('+password +refreshToken');
        if (!user) throw new ApiError(401, 'Invalid email or password');

        if (user.status !== 'active') throw new ApiError(403, 'Account is inactive');

        const isMatch = await comparePassword(data.password, user.password);
        if (!isMatch) throw new ApiError(401, 'Invalid email or password');

        const payload: JwtPayload = {
            id: user._id.toString(),
            role: user.role,
            email: user.email,
        };

        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        user.refreshToken = refreshToken;
        await user.save();

        return {
            accessToken,
            refreshToken,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        };
    }

    async refresh(token: string) {
        if (!token) throw new ApiError(401, 'Refresh token required');

        let payload: JwtPayload;
        try {
            payload = verifyRefreshToken(token);
        } catch {
            throw new ApiError(401, 'Invalid or expired refresh token');
        }

        const user = await User.findById(payload.id).select('+refreshToken');
        if (!user || user.refreshToken !== token) {
            throw new ApiError(401, 'Refresh token is invalid or has been revoked');
        }

        const newPayload: JwtPayload = { id: user._id.toString(), role: user.role, email: user.email };
        const accessToken = signAccessToken(newPayload);
        const refreshToken = signRefreshToken(newPayload);

        user.refreshToken = refreshToken;
        await user.save();

        return { accessToken, refreshToken };
    }

    async logout(userId: string) {
        await User.findByIdAndUpdate(userId, { refreshToken: undefined });
    }
}
