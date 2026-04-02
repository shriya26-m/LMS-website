import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { progressService } from '../../services/progress.service';
import type { Progress, Course } from '../../types';

export default function StudentProgress() {
    const navigate = useNavigate();
    const [progresses, setProgresses] = useState<Progress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await progressService.getMy();
                setProgresses(res.data.data || []);
            } catch {
                setProgresses([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <Layout title="My Progress">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Progress</h1>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white dark:bg-slate-800 rounded-2xl" />)}
                    </div>
                ) : progresses.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-slate-700">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white pb-2">No courses enrolled yet</h3>
                        <p className="text-gray-500">When you enroll in courses, your progress will appear here.</p>
                        <button
                            onClick={() => navigate('/student/courses')}
                            className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
                        >
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {progresses.map(p => {
                            const course = p.courseId as any as Course;
                            return (
                                <div key={p._id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6 items-center hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all">
                                    <div className="w-full md:w-32 h-20 bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop'}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 w-full min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate pr-4">{course.title}</h3>
                                            {p.isCompleted ?
                                                <span className="flex items-center gap-1 text-[10px] uppercase font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-md tracking-widest"><CheckCircle className="w-3 h-3" /> Completed</span> :
                                                <span className="flex items-center gap-1 text-[10px] uppercase font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md tracking-widest"><Clock className="w-3 h-3" /> In Progress</span>
                                            }
                                        </div>
                                        <p className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-tighter">
                                            {p.completedLessons?.length || 0} of {course.totalLessons || 0} lessons completed
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${p.isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                                                    style={{ width: `${p.progressPercent}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-8">{Math.round(p.progressPercent)}%</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/course/${course._id}/learn`)}
                                        className={`w-full md:w-auto px-6 py-2.5 font-bold rounded-xl transition whitespace-nowrap shadow-sm ${p.isCompleted ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'}`}
                                    >
                                        {p.isCompleted ? 'Review' : 'Continue'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}
