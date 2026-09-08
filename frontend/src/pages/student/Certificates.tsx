import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Eye, Search } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { certificatesService } from '../../services/progress.service';
import type { Certificate, Course } from '../../types';

export default function Certificates() {
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await certificatesService.getMy();
                setCertificates(res.data.data || []);
            } catch {
                setCertificates([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <Layout title="Certificates">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-white dark:bg-slate-800 rounded-3xl" />
                        ))}
                    </div>
                ) : certificates.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-16 text-center border border-gray-100 dark:border-slate-700 shadow-sm">
                        <div className="w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award className="w-12 h-12 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white pb-2">No certificates earned yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8">Finish your first course to 100% and your official certificate will be automatically issued here.</p>
                        <button
                            onClick={() => navigate('/student/courses')}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 dark:shadow-none"
                        >
                            <Search className="w-5 h-5" /> Browse Courses
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map(cert => {
                            const course = cert.courseId as any as Course;
                            return (
                                <div key={cert._id} className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-900/50 transition-all hover:shadow-2xl hover:shadow-amber-500/10">
                                    {/* Thumbnail / Header */}
                                    <div className="h-32 relative bg-slate-900 overflow-hidden">
                                        <img
                                            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop'}
                                            alt={course.title}
                                            className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                                        <div className="absolute bottom-4 left-4">
                                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-1 rounded">Official Award</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 pt-4">
                                        <div className="flex justify-between items-start mb-2 text-xs font-mono text-gray-400">
                                            <span>#{cert.certificateCode}</span>
                                            <span>{new Date(cert.issueDate).getFullYear()}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{course.title}</h3>
                                        <p className="text-xs text-gray-500 mb-6 font-medium">Earned on {new Date(cert.issueDate).toLocaleDateString()}</p>

                                        <button
                                            onClick={() => navigate(`/student/certificates/${course._id}/view`)}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-sm font-bold rounded-2xl transition shadow-lg"
                                        >
                                            <Eye className="w-4 h-4" /> View Certificate
                                        </button>
                                    </div>

                                    {/* Decorative Icon */}
                                    <Award className="absolute -top-4 -right-4 w-16 h-16 text-amber-500/10 rotate-12" />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}
