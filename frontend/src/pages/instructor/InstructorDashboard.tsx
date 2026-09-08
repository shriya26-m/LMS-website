import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Star, TrendingUp, FileText, Loader2 } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useAuthStore } from '../../store/authStore';
import { coursesService } from '../../services/courses.service';
import { submissionsService } from '../../services/assignments.service';
import type { Course, Submission } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function InstructorDashboard() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [coursesRes, subsRes] = await Promise.all([
                    coursesService.getMyCourses(),
                    submissionsService.getInstructorSubmissions()
                ]);
                setCourses(coursesRes.data.data.data || []);
                setSubmissions((subsRes.data.data || []).slice(0, 5));
            } catch {
                // show empty state
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0);
    const avgRating = courses.length > 0 ? (courses.reduce((acc, c) => acc + (c.rating || 0), 0) / courses.length) : 0;
    const pendingGrades = submissions.filter(s => s.status === 'submitted').length;

    // Build enrollment chart from real course data
    const enrollmentChartData = courses.slice(0, 6).map(c => ({
        name: c.title.length > 14 ? c.title.substring(0, 14) + '…' : c.title,
        students: c.enrolledStudents?.length || 0,
    }));

    const stats = [
        { title: 'Total Students', value: totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { title: 'My Courses', value: courses.length, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { title: 'Avg Rating', value: avgRating > 0 ? avgRating.toFixed(1) : 'N/A', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
        { title: 'Pending Reviews', value: pendingGrades, icon: FileText, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
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

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <>
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
                            {/* Enrollment Chart */}
                            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Student Enrollment by Course</h2>
                                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                                </div>
                                {enrollmentChartData.length > 0 ? (
                                    <div className="h-72">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={enrollmentChartData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                                                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-72 flex flex-col items-center justify-center text-center text-gray-400">
                                        <BookOpen className="w-12 h-12 mb-3 opacity-30" />
                                        <p className="font-medium">No courses yet</p>
                                        <p className="text-sm mt-1">Create your first course to see enrollment data</p>
                                    </div>
                                )}
                            </div>

                            {/* Recent Submissions */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Submissions</h2>
                                    <button onClick={() => navigate('/instructor/submissions')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition">View All</button>
                                </div>
                                {submissions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
                                        <FileText className="w-10 h-10 mb-3 opacity-30" />
                                        <p className="text-sm font-medium">No submissions yet</p>
                                        <p className="text-xs mt-1 text-gray-400">Student submissions will appear here</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {submissions.map(s => (
                                            <div key={s._id} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-slate-700 last:border-0 last:pb-0">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm flex-shrink-0">
                                                    {(s.studentId as any)?.name?.charAt(0) || 'S'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{(s.studentId as any)?.name || 'Student'}</p>
                                                    <p className="text-xs text-gray-500 truncate">{(s.assignmentId as any)?.title || 'Assignment'}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(s.submittedAt).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full flex-shrink-0 ${s.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {s.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}


