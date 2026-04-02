import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Star, Plus, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import { coursesService } from '../../services/courses.service';
import type { Course } from '../../types';

export default function InstructorCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await coursesService.getMyCourses();
                setCourses(res.data.data.data || []);
            } catch {
                setCourses([
                    { _id: '1', title: 'React Masterclass', category: 'Programming', price: 99, isPublished: true, enrolledStudents: Array(45).fill('id'), rating: 4.8 } as any,
                    { _id: '2', title: 'Vue.js Fundamentals', category: 'Programming', price: 49, isPublished: false, enrolledStudents: [], rating: 0 } as any,
                ]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handlePublish = async (id: string) => {
        try {
            await coursesService.publish(id);
            toast.success('Course status updated!');
            const res = await coursesService.getMyCourses();
            setCourses(res.data.data.data || []);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    return (
        <Layout title="My Courses">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Courses</h1>
                    <button
                        onClick={() => navigate('/instructor/courses/create')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow"
                    >
                        <Plus className="w-4 h-4" /> New Course
                    </button>
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-24 bg-white dark:bg-slate-800 rounded-2xl" />)}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-slate-700">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white pb-2">No courses yet</h3>
                        <p className="text-gray-500">Create your first course to start teaching!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {courses.map(c => (
                            <div key={c._id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4" shadow-sm>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{c.title}</h3>
                                        <p className="text-sm text-gray-500 mb-1">{c.category} • ${c.price}</p>
                                        <div className="flex items-center gap-3 text-xs font-medium">
                                            {c.isPublished ?
                                                <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">Published</span> :
                                                <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Draft</span>
                                            }
                                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400"><User className="w-3.5 h-3.5" /> {c.enrolledStudents?.length || 0}</span>
                                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> {c.rating || 0}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex w-full md:w-auto gap-2">
                                    <button
                                        onClick={() => handlePublish(c._id)}
                                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 font-medium rounded-xl transition border ${c.isPublished
                                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                            : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'}`}
                                    >
                                        {c.isPublished ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/instructor/courses/${c._id}/content`)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-xl transition border border-indigo-100"
                                    >
                                        <BookOpen className="w-4 h-4" /> Manage Content
                                    </button>
                                    <button
                                        onClick={() => navigate(`/instructor/courses/edit/${c._id}`)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition border border-gray-200 dark:border-slate-600"
                                    >
                                        <Edit2 className="w-4 h-4" /> Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
