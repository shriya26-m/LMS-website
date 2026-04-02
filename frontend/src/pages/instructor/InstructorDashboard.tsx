import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Star, DollarSign } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useAuthStore } from '../../store/authStore';
import { coursesService } from '../../services/courses.service';
import type { Course } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
    { month: 'Jan', revenue: 400 }, { month: 'Feb', revenue: 300 },
    { month: 'Mar', revenue: 550 }, { month: 'Apr', revenue: 450 },
    { month: 'May', revenue: 700 }, { month: 'Jun', revenue: 650 },
];

export default function InstructorDashboard() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await coursesService.getMyCourses();
                setCourses(res.data.data.data || []);
            } catch {
                // Fallback or empty empty
            }
        };
        load();
    }, []);

    const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0);
    const avgRating = courses.length ? courses.reduce((acc, c) => acc + c.rating, 0) / courses.length : 0;

    const stats = [
        { title: 'Total Revenue', value: '$2,450', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Active Students', value: totalStudents || 124, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'My Courses', value: courses.length || 4, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Average Rating', value: avgRating ? avgRating.toFixed(1) : '4.8', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    ];

    const recentReviews = [
        { id: 1, user: 'Alice Smith', course: 'React Masterclass', rating: 5, comment: 'Amazing course! Very clear explanations.', time: '2 hours ago' },
        { id: 2, user: 'John Doe', course: 'Node.js Backend', rating: 4, comment: 'Good content, could use more exercises.', time: '5 hours ago' },
    ];

    return (
        <Layout title="Instructor Dashboard">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.name || 'Instructor'}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's an overview of your teaching performance.</p>
                    </div>
                    <button onClick={() => navigate('/instructor/courses/create')} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow shadow-indigo-200 dark:shadow-none">
                        + Create New Course
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${s.bg}`}>
                                <s.icon className={`w-6 h-6 ${s.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{s.title}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Analytics</h2>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Reviews/Activity */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Reviews</h2>
                        </div>
                        <div className="space-y-5">
                            {recentReviews.map(r => (
                                <div key={r.id} className="pb-5 border-b border-gray-100 dark:border-slate-700 last:border-0 last:pb-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{r.user}</span>
                                        <span className="text-xs text-gray-500">{r.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-2">"{r.comment}"</p>
                                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-2">On: {r.course}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
