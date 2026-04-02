import { useState, useEffect, useCallback } from 'react';
import { FileText, CheckCircle, Clock, ExternalLink, Loader2, X } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { submissionsService } from '../../services/assignments.service';
import type { Submission } from '../../types';
import toast from 'react-hot-toast';

export default function InstructorSubmissions() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
    const [grading, setGrading] = useState(false);
    const [gradeData, setGradeData] = useState({ grade: 0, feedback: '' });

    const loadSubmissions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await submissionsService.getInstructorSubmissions();
            setSubmissions(res.data.data);
        } catch (error) {
            toast.error('Failed to load submissions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSubmissions();
    }, [loadSubmissions]);

    const handleGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSub) return;

        setGrading(true);
        try {
            await submissionsService.grade(selectedSub._id, gradeData);
            toast.success('Submission graded successfully');
            setSelectedSub(null);
            loadSubmissions();
        } catch (error) {
            toast.error('Failed to grade submission');
        } finally {
            setGrading(false);
        }
    };

    const openGradeModal = (sub: Submission) => {
        setSelectedSub(sub);
        setGradeData({
            grade: sub.grade || 0,
            feedback: sub.feedback || ''
        });
    };

    return (
        <Layout title="Student Submissions">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Submissions</h1>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-white dark:bg-slate-800 rounded-2xl animate-pulse border border-gray-100 dark:border-slate-700" />
                        ))}
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-16 text-center border border-gray-100 dark:border-slate-700">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white pb-2">No submissions yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Assignments submitted by your students will appear here for review.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Student</th>
                                        <th className="px-6 py-4 font-semibold">Assignment</th>
                                        <th className="px-6 py-4 font-semibold">Submitted</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                    {submissions.map(sub => (
                                        <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold">
                                                        {(sub.studentId as any)?.name?.charAt(0) || 'S'}
                                                    </div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{(sub.studentId as any)?.name || 'Unknown Student'}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 dark:text-white">{(sub.assignmentId as any)?.title || 'Deleted Assignment'}</div>
                                                <div className="text-xs text-gray-500">{(sub.assignmentId as any)?.courseId?.title || 'Course'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(sub.submittedAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {sub.status === 'submitted' ? (
                                                    <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase">Pending</span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-500 font-bold">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Graded ({sub.grade}/100)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openGradeModal(sub)}
                                                    className={`px-4 py-1.5 rounded-lg transition text-xs font-bold uppercase tracking-wider ${sub.status === 'submitted'
                                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                                                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300'
                                                        }`}
                                                >
                                                    {sub.status === 'submitted' ? 'Review' : 'Update'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Grading Modal */}
                {selectedSub && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-slate-800 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-700">
                            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Review Submission</h2>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">{(selectedSub.studentId as any)?.name || 'Student'}</p>
                                </div>
                                <button onClick={() => setSelectedSub(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleGrade} className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                                        <h4 className="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-1">Assignment</h4>
                                        <p className="font-bold text-gray-900 dark:text-white text-lg">{(selectedSub.assignmentId as any)?.title}</p>
                                    </div>

                                    {selectedSub.textContent && (
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Submission Text</label>
                                            <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-slate-700 text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-h-40 overflow-y-auto">
                                                {selectedSub.textContent}
                                            </div>
                                        </div>
                                    )}

                                    {selectedSub.fileUrl && (
                                        <a
                                            href={selectedSub.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5" />
                                                <span className="font-bold">View Submitted File</span>
                                            </div>
                                            <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition" />
                                        </a>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Grade (0-100)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                required
                                                value={gradeData.grade}
                                                onChange={(e) => setGradeData({ ...gradeData, grade: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white font-bold"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Feedback (Optional)</label>
                                        <textarea
                                            rows={3}
                                            value={gradeData.feedback}
                                            onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                                            placeholder="Great work! Keep it up..."
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 dark:text-gray-300 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedSub(null)}
                                        className="flex-1 py-3 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={grading}
                                        className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition flex items-center justify-center gap-2"
                                    >
                                        {grading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {selectedSub.status === 'submitted' ? 'Submit Grade' : 'Update Grade'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
