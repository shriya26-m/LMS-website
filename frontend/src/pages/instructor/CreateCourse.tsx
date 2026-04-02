import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import { coursesService } from '../../services/courses.service';
import { uploadService } from '../../services/upload.service';

interface CourseFormData {
    title: string;
    description: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    price: number;
    thumbnail?: string;
}

export default function CreateCourse() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CourseFormData>({
        defaultValues: {
            level: 'beginner',
            price: 0
        }
    });

    const thumbnailUrl = watch('thumbnail');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const res = await uploadService.uploadSingle(file);
            setValue('thumbnail', res.data.data.url);
            toast.success('Thumbnail uploaded!');
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: CourseFormData) => {
        setLoading(true);
        try {
            await coursesService.create(data);
            toast.success('Course created successfully!');
            navigate('/instructor/courses');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Create Course">
            <div className="max-w-4xl mx-auto space-y-6">
                <button
                    onClick={() => navigate('/instructor/courses')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Courses
                </button>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Course Details</h2>
                        <p className="text-sm text-gray-500">Fill in the information below to create your new course.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Title</label>
                                <input
                                    {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'Minimum 5 characters' } })}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    placeholder="Enter course title"
                                />
                                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'Minimum 20 characters' } })}
                                    rows={4}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                                    placeholder="Tell students what they will learn..."
                                />
                                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                <input
                                    {...register('category', { required: 'Category is required' })}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    placeholder="e.g. Programming, Design"
                                />
                                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Level</label>
                                <select
                                    {...register('level')}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
                                <input
                                    type="number"
                                    {...register('price', { valueAsNumber: true, min: { value: 0, message: 'Price cannot be negative' } })}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    placeholder="0 for free"
                                />
                                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Thumbnail</label>
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            {uploading ? <Loader2 className="w-5 h-5 animate-spin text-indigo-500" /> : <Upload className="w-5 h-5 text-gray-400" />}
                                        </div>
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            accept="image/*"
                                            className="w-full h-11 opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="absolute inset-0 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl flex items-center px-4 pointer-events-none">
                                            <span className="text-sm text-gray-500 ml-8">
                                                {thumbnailUrl ? 'Change Image' : 'Click to upload thumbnail'}
                                            </span>
                                        </div>
                                    </div>
                                    {thumbnailUrl && (
                                        <div className="w-16 h-11 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                                            <img src={thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-200 dark:shadow-none"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Create Course
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
