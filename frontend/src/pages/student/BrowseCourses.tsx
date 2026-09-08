import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Users, BookOpen, Play } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { coursesService } from '../../services/courses.service';
import type { Course } from '../../types';
import toast from 'react-hot-toast';

const LEVELS = ['all', 'beginner', 'intermediate', 'advanced'];

export default function BrowseCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const [level, setLevel] = useState('all');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [enrollingId, setEnrollingId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadCourses();
        loadCategories();
    }, [search, level, category, page]);

    const loadCourses = async () => {
        setLoading(true);
        try {
            const res = await coursesService.getAll(page, 12, search || undefined, category || undefined, level === 'all' ? undefined : level);
            setCourses(res.data.data.data);
            setTotalPages(res.data.data.totalPages);
        } catch { setCourses([]); }
        finally { setLoading(false); }
    };

    const loadCategories = async () => {
        try {
            const res = await coursesService.getCategories();
            setCategories(res.data.data);
        } catch { }
    };

    const handleEnroll = async (courseId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setEnrollingId(courseId);
        try {
            await coursesService.enroll(courseId);
            toast.success('Enrolled successfully! 🎉');
            navigate(`/course/${courseId}/learn`);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            toast.error(e.response?.data?.message || 'Enrollment failed');
        } finally { setEnrollingId(null); }
    };

    const levelBadge = { beginner: 'bg-green-100 text-green-700', intermediate: 'bg-yellow-100 text-yellow-700', advanced: 'bg-red-100 text-red-700' };


    return (
        <Layout title="Browse Courses">
            <div className="space-y-6">
                {/* Search & Filters */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="Search courses..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-11 pr-4 py-2.5 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                        </div>
                        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            {categories.length === 0 && ['Programming', 'Design', 'Data Science', 'Computer Science', 'DevOps'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="flex gap-2">
                            {LEVELS.map(l => (
                                <button key={l} onClick={() => { setLevel(l); setPage(1); }}
                                    className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition ${level === l ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50'}`}>
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {loading ? 'Loading...' : `Showing ${courses.length} course${courses.length !== 1 ? 's' : ''}`}
                </p>

                {/* Course Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
                                <div className="h-44 bg-gray-200 dark:bg-slate-700" />
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No courses found</h3>
                        <p className="text-sm text-gray-500 mt-2 max-w-sm">
                            {search || category ? 'Try adjusting your search or filters.' : 'No courses are available yet. Check back soon!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => {
                            const instructor = typeof course.instructorId === 'object' ? (course.instructorId as { name: string }).name : 'Instructor';
                            const lvlBadge = levelBadge[course.level] || 'bg-gray-100 text-gray-700';
                            return (
                                <div key={course._id}
                                    className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                                    onClick={() => navigate(`/student/courses/${course._id}`)}>
                                    <div className="relative overflow-hidden h-44">
                                        <img src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop'}
                                            alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <span className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-lg ${lvlBadge}`}>
                                            {course.level}
                                        </span>
                                        {course.price === 0 && (
                                            <span className="absolute top-3 right-3 text-xs font-bold px-2 py-1 bg-green-500 text-white rounded-lg">FREE</span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{course.category}</span>
                                        <h3 className="font-bold text-gray-900 dark:text-white mt-1 leading-tight line-clamp-2">{course.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">by {instructor}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{course.description}</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />{course.rating.toFixed(1)}</span>
                                            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.totalLessons} lessons</span>
                                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.enrolledStudents?.length || 0}</span>
                                        </div>
                                        <button
                                            onClick={(e) => handleEnroll(course._id, e)}
                                            disabled={enrollingId === course._id}
                                            className="w-full mt-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2">
                                            {enrollingId === course._id ? 'Enrolling...' : <><Play className="w-4 h-4" /> Enroll Now</>}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setPage(p)}
                                className={`w-9 h-9 rounded-xl text-sm font-medium transition ${p === page ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 hover:border-indigo-300'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
