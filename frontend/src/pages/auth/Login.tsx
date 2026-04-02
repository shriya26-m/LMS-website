import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';
import type { AuthUser } from '../../types';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore(s => s.setAuth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authService.login(form);
            const { accessToken, refreshToken, user } = res.data.data;
            const authUser: AuthUser = { id: user.id, email: user.email, role: user.role as AuthUser['role'], name: user.name };
            setAuth(authUser, accessToken, refreshToken);
            toast.success(`Welcome back, ${user.name || user.email}!`);
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'instructor') navigate('/instructor');
            else navigate('/student');
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            toast.error(e.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl mb-4">
                        <GraduationCap className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">LearnHub</h1>
                    <p className="text-purple-300 mt-1">Sign in to continue learning</p>
                </div>

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Welcome back</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                                <input
                                    type="email" name="email" value={form.email} onChange={handleChange} required
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                                <input
                                    type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit" disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</> : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-purple-300 mt-6 text-sm">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="text-white font-semibold hover:text-purple-200 transition">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
