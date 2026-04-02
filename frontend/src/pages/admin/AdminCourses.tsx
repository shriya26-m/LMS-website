import { useState, useEffect, useCallback } from 'react';
import { BookOpen, User, Star, Trash2, Eye, Search, Filter, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { coursesService } from '../../services/courses.service';
import type { Course, PaginatedResponse } from '../../types';
import toast from 'react-hot-toast';

export default function AdminCourses() {
    const [coursesData, setCoursesData] = useState<PaginatedResponse<Course> | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);

    const loadCourses = useCallback(async () => {
        setLoading(true);
        try {
            // Updated coursesService to optionally accept category
            const res = await coursesService.getAll(page, 10);
            setCoursesData(res.data.data);
        } catch (error) {
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    const handleDeleteCourse = async (courseId: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This will remove all associated lessons and progress.`)) return;

        try {
            await coursesService.delete(courseId);
            toast.success('Course deleted successfully');
            loadCourses();
        } catch (error) {
            toast.error('Failed to delete course');
        }
    };

    const filteredCourses = coursesData?.data.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.category.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === '' || c.category.toLowerCase() === category.toLowerCase();
        return matchesSearch && matchesCategory;
    }) || [];

    return (
        <Layout title="Manage Courses">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Courses</h1>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses or categories..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <select
                                value={category}
                                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                                className="pl-10 pr-8 py-2 border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none outline-none"
                            >
                                <option value="">All Categories</option>
                                <option value="programming">Programming</option>
                                <option value="design">Design</option>
                                <option value="business">Business</option>
                                <option value="marketing">Marketing</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Course Details</th>
                                    <th className="px-6 py-4 font-semibold">Instructor</th>
                                    <th className="px-6 py-4 font-semibold">Stats</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {loading && filteredCourses.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                                                <span className="text-gray-500">Loading courses...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredCourses.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No courses found on the platform.
                                        </td>
                                    </tr>
                                ) : filteredCourses.map(c => (
                                    <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {c.thumbnail ? (
                                                    <img src={c.thumbnail} alt={c.title} className="w-10 h-10 rounded-lg object-cover border border-gray-100 dark:border-slate-600" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-indigo-400 font-bold flex-shrink-0">
                                                        <BookOpen className="w-5 h-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{c.title}</div>
                                                    <div className="text-xs text-gray-500">{c.category} • ${c.price}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {(c.instructorId as any)?.name || 'Unknown Instructor'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                                                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {c.enrolledStudents?.length || 0}</span>
                                                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> {c.rating ? c.rating.toFixed(1) : '0.0'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.isPublished ?
                                                <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-lg text-xs font-semibold">Published</span> :
                                                <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-lg text-xs font-semibold">Draft</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-gray-400 hover:text-indigo-600 transition" title="View Details"><Eye className="w-4 h-4" /></button>
                                                <button
                                                    onClick={() => handleDeleteCourse(c._id, c.title)}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {coursesData && coursesData.totalPages > 1 && (
                        <div className="p-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                Showing page {coursesData.page} of {coursesData.totalPages}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    disabled={!coursesData.hasPrev}
                                    onClick={() => setPage(p => p - 1)}
                                    className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                                >
                                    <ChevronLeft className="w-4 h-4 dark:text-white" />
                                </button>
                                <button
                                    disabled={!coursesData.hasNext}
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
