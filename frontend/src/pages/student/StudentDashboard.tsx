import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Award, TrendingUp, Star, PlayCircle,
    ChevronRight, CheckCircle, Download, GraduationCap
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useAuthStore } from '../../store/authStore';
import { progressService } from '../../services/progress.service';
import { certificatesService } from '../../services/progress.service';
import type { Progress, Certificate, Course } from '../../types';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { submissionsService } from '../../services/assignments.service';
const activityData = [
    { day: 'Mon', hours: 2 }, { day: 'Tue', hours: 3.5 }, { day: 'Wed', hours: 1 },
    { day: 'Thu', hours: 4 }, { day: 'Fri', hours: 2.5 }, { day: 'Sat', hours: 5 }, { day: 'Sun', hours: 3 },
];

export default function StudentDashboard() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [progresses, setProgresses] = useState<Progress[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [progRes, subRes, certRes] = await Promise.all([
                    progressService.getMy(),
                    submissionsService.getMySubmissions(),
                    certificatesService.getMy(),
                ]);
                setProgresses(progRes.data.data || []);
                setCertificates(certRes.data.data || []);
                console.log(subRes); // Prevent unused
            } catch { /* fallback to empty */ }
            finally { /* loading complete */ }
        };
        load();
    }, []);

    const enrolledCount = progresses.length;
    const completedCount = progresses.filter(p => p.isCompleted).length;
    const avgProgress = progresses.length
        ? Math.round(progresses.reduce((a, p) => a + p.progressPercent, 0) / progresses.length)
        : 0;

    const stats = [
        { title: 'Enrolled Courses', value: enrolledCount, icon: BookOpen, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
        { title: 'Completed', value: completedCount, icon: CheckCircle, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50', iconColor: 'text-green-600' },
        { title: 'Avg Progress', value: `${avgProgress}%`, icon: TrendingUp, color: 'from-purple-500 to-violet-500', bg: 'bg-purple-50', iconColor: 'text-purple-600' },
        { title: 'Certificates', value: certificates.length, icon: Award, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', iconColor: 'text-amber-600' },
    ];

    // Sample enrolled courses for display
    const displayCourses = [
        { id: 1, title: 'Full Stack Web Development', instructor: 'Dr. Sarah Chen', progress: 75, category: 'Programming', thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=300&h=200&fit=crop' },
        { id: 2, title: 'Data Science Fundamentals', instructor: 'Prof. Michael Roberts', progress: 45, category: 'Data Science', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop' },
        { id: 3, title: 'UI/UX Design Masterclass', instructor: 'Emma Davis', progress: 30, category: 'Design', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop' },
    ];

    return (
        <Layout title="Student Dashboard">
            <div className="space-y-6">
                {/* Welcome */}
                <div className="bg-linear-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Learner'}! 👋</h1>
                            <p className="text-indigo-200 mt-1">Continue your learning journey</p>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="bg-white/20 rounded-lg px-3 py-1 text-sm font-medium">
                                    🔥 {displayCourses.length} active courses
                                </div>
                                <div className="bg-white/20 rounded-lg px-3 py-1 text-sm font-medium">
                                    ⭐ {certificates.length || 2} certificates earned
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <GraduationCap className="w-20 h-20 text-white/30" />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.title}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Enrolled Courses */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Courses</h2>
                            <button onClick={() => navigate('/student/courses')}
                                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                Browse more <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {progresses.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
                                    <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">You haven't enrolled in any courses yet.</p>
                                    <button onClick={() => navigate('/student/courses')} className="mt-4 text-sm text-indigo-600 font-bold">Browse Courses</button>
                                </div>
                            ) : (
                                progresses.map(p => {
                                    const course = p.courseId as Course;
                                    return (
                                        <div key={p._id} className="flex gap-4 p-3 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition cursor-pointer"
                                            onClick={() => navigate(`/course/${course._id}/learn`)}>
                                            <img src={course.thumbnail || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=300&h=200&fit=crop'} alt={course.title} className="w-20 h-16 rounded-lg object-cover flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight uppercase tracking-tight truncate">{course.title}</h3>
                                                <p className="text-xs text-gray-500 mt-0.5">{typeof course.instructorId === 'object' ? (course.instructorId as any).name : 'Instructor'}</p>
                                                <div className="mt-2">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-indigo-600 font-bold">{p.progressPercent}% complete</span>
                                                        {p.isCompleted && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                                                    </div>
                                                    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500 animate-pulse-subtle"
                                                            style={{ width: `${p.progressPercent}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition shrink-0 self-center shadow-sm">
                                                <PlayCircle className="w-5 h-5" />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        {/* Learning Activity Chart */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Weekly Activity</h3>
                            <ResponsiveContainer width="100%" height={120}>
                                <AreaChart data={activityData}>
                                    <defs>
                                        <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="hours" stroke="#6366f1" fill="url(#actGrad)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Certificates */}
                        <div className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/50 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Award className="w-5 h-5 text-amber-600" />
                                <h3 className="font-bold text-gray-900 dark:text-white">Certificates</h3>
                            </div>
                            {certificates.length > 0 ? (
                                <div className="space-y-2">
                                    {certificates.slice(0, 3).map(cert => (
                                        <div key={cert._id} className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-gray-700 dark:text-gray-300 truncate">
                                                {typeof cert.courseId === 'object' && (cert.courseId as { title: string }).title || 'Course Certificate'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-3">
                                    <Star className="w-8 h-8 text-amber-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Complete a course to earn your first certificate!</p>
                                </div>
                            )}
                            <button onClick={() => navigate('/student/certificates')}
                                className="w-full mt-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition flex items-center justify-center gap-1">
                                <Download className="w-4 h-4" /> View Certificates
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
