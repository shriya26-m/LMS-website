import { User } from './user.model';
import { ApiError } from '../../utils/ApiError';
import { paginate } from '../../utils/paginate.util';

export class UserService {
    async getAllUsers(page = 1, limit = 10, role?: string) {
        const query: Record<string, unknown> = {};
        if (role) query.role = role;

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-refreshToken')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        return paginate(users, total, { page, limit });
    }

    async getUserById(id: string) {
        const user = await User.findById(id).select('-refreshToken');
        if (!user) throw new ApiError(404, 'User not found');
        return user;
    }

    async updateUser(id: string, data: { name?: string; bio?: string; avatar?: string; status?: string; role?: string }) {
        const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-refreshToken');
        if (!user) throw new ApiError(404, 'User not found');
        return user;
    }

    async deleteUser(id: string) {
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new ApiError(404, 'User not found');
    }

    async getStats() {
        const [totalUsers, students, instructors, admins] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'instructor' }),
            User.countDocuments({ role: 'admin' }),
        ]);
        return { totalUsers, students, instructors, admins };
    }
}
