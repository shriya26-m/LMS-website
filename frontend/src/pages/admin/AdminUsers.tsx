import { useState, useEffect, useCallback } from 'react';
import { User as UserIcon, Shield, Ban, CheckCircle, Clock, Search, Filter, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { usersService } from '../../services/users.service';
import type { User, PaginatedResponse } from '../../types';
import toast from 'react-hot-toast';

export default function AdminUsers() {
    const [usersData, setUsersData] = useState<PaginatedResponse<User> | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [page, setPage] = useState(1);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await usersService.getAll(page, role);
            setUsersData(res.data.data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [page, role]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleDeleteUser = async (userId: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;

        try {
            await usersService.delete(userId);
            toast.success('User deleted successfully');
            loadUsers();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const roleBadge = {
        admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        instructor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        student: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    };

    const filteredUsers = usersData?.data.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <Layout title="Manage Users">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Users</h1>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <select
                                value={role}
                                onChange={(e) => { setRole(e.target.value); setPage(1); }}
                                className="pl-10 pr-8 py-2 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none outline-none"
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Admins</option>
                                <option value="instructor">Instructors</option>
                                <option value="student">Students</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">User Info</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Joined</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {loading && filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                                                <span className="text-gray-500">Loading users...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : filteredUsers.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {u.avatar ? (
                                                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-gray-100 dark:border-slate-600 object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-white">{u.name}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 uppercase">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider ${roleBadge[u.role as keyof typeof roleBadge]}`}>
                                                {u.role === 'admin' && <Shield className="w-3 h-3 inline mr-1 -mt-0.5" />}
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            {u.isEmailVerified ?
                                                <span className="flex items-center gap-1 text-green-600 dark:text-green-500 text-xs font-semibold"><CheckCircle className="w-4 h-4" /> Verified</span> :
                                                <span className="flex items-center gap-1 text-amber-500 text-xs font-semibold"><Clock className="w-4 h-4" /> Pending</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-gray-400 hover:text-indigo-600 transition" title="View Profile"><UserIcon className="w-4 h-4" /></button>
                                                {u.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id, u.name)}
                                                        className="p-2 text-gray-400 hover:text-red-600 transition"
                                                        title="Delete User"
                                                    >
                                                        <Ban className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {usersData && usersData.totalPages > 1 && (
                        <div className="p-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                Showing page {usersData.page} of {usersData.totalPages}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    disabled={!usersData.hasPrev}
                                    onClick={() => setPage(p => p - 1)}
                                    className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                                >
                                    <ChevronLeft className="w-4 h-4 dark:text-white" />
                                </button>
                                <button
                                    disabled={!usersData.hasNext}
                                    onClick={() => setPage(p => p + 1)}
                                    className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                                >
                                    <ChevronRight className="w-4 h-4 dark:text-white" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
