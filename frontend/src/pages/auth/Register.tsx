import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';
import type { AuthUser } from '../../types';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore(s => s.setAuth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authService.register(form);
            const { accessToken, refreshToken, user } = res.data.data;
            const authUser: AuthUser = { id: user.id, email: user.email, role: user.role as AuthUser['role'], name: user.name };
            setAuth(authUser, accessToken, refreshToken);
            toast.success('Account created! Welcome to LearnHub 🎉');
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'instructor') navigate('/instructor');
            else navigate('/student');
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            toast.error(e.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl mb-4">
                        <GraduationCap className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">LearnHub</h1>
                    <p className="text-purple-300 mt-1">Start your learning journey</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Create account</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                                <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe"
                                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required placeholder="Min. 6 characters"
                                    className="w-full pl-11 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white transition">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-purple-200 mb-1.5">I am a...</label>
                            <select name="role" value={form.role} onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                                <option value="student" className="text-gray-900">Student</option>
                                <option value="instructor" className="text-gray-900">Instructor</option>
                            </select>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</> : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-purple-300 mt-6 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-white font-semibold hover:text-purple-200 transition">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
