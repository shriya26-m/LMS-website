import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, CheckCircle, Clock, BookOpen, Loader2, Award } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { progressService } from '../../services/progress.service';
import { assignmentsService, submissionsService } from '../../services/assignments.service';
import type { Assignment, Submission, Course, Progress } from '../../types';

interface AssignmentWithStatus extends Assignment {
    courseName: string;
    courseId: string;
    submission?: Submission;
}

export default function StudentAssignments() {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState<AssignmentWithStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [textContent, setTextContent] = useState<Record<string, string>>({});

    useEffect(() => {
        const load = async () => {
            try {
                // 1. Fetch all enrolled courses via progress records
                const progressRes = await progressService.getMy();
                const progresses: Progress[] = progressRes.data.data || [];

                if (progresses.length === 0) {
                    setAssignments([]);
                    return;
                }

                // 2. Fetch assignments for each enrolled course in parallel
                const [assignmentResults, submissionsRes] = await Promise.all([
                    Promise.all(
                        progresses.map(p => {
                            const course = p.courseId as Course;
                            return assignmentsService.getByCourse(course._id)
                                .then(res => ({ courseId: course._id, courseName: course.title, assignments: res.data.data }))
                                .catch(() => ({ courseId: course._id, courseName: course.title, assignments: [] }));
                        })
                    ),
                    submissionsService.getMySubmissions()
                ]);

                const mySubmissions: Submission[] = submissionsRes.data.data || [];

                // 3. Flatten and merge
                const flat: AssignmentWithStatus[] = [];
                for (const result of assignmentResults) {
                    for (const a of result.assignments) {
                        const submission = mySubmissions.find(s =>
                            (typeof s.assignmentId === 'object'
                                ? (s.assignmentId as Assignment)._id
                                : s.assignmentId) === a._id
                        );
                        flat.push({
                            ...a,
                            courseName: result.courseName,
                            courseId: result.courseId,
                            submission,
                        });
                    }
                }

                // Sort: pending first, then by deadline
                flat.sort((a, b) => {
                    if (!a.submission && b.submission) return -1;
                    if (a.submission && !b.submission) return 1;
                    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                });

                setAssignments(flat);
            } catch {
                setAssignments([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSubmit = async (assignmentId: string) => {
        const text = textContent[assignmentId] || '';
        if (!text.trim()) return;
        setSubmitting(assignmentId);
        try {
            await submissionsService.submit({ assignmentId, textContent: text });
            // Refresh assignments
            const updatedSubs = await submissionsService.getMySubmissions();
            setAssignments(prev => prev.map(a => {
                const submission = (updatedSubs.data.data || []).find(s =>
                    (typeof s.assignmentId === 'object'
                        ? (s.assignmentId as Assignment)._id
                        : s.assignmentId) === a._id
                );
                return { ...a, submission };
            }));
            setTextContent(prev => ({ ...prev, [assignmentId]: '' }));
        } catch { /* silently fail */ }
        finally { setSubmitting(null); }
    };

    const isPastDeadline = (deadline: string) => new Date() > new Date(deadline);
    const pendingCount = assignments.filter(a => !a.submission).length;
    const gradedCount = assignments.filter(a => a.submission?.status === 'graded').length;

    return (
        <Layout title="Assignments">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Assignments</h1>
                        <p className="text-sm text-gray-500 mt-1">{assignments.length} total • {pendingCount} pending • {gradedCount} graded</p>
                    </div>
                    <button onClick={() => navigate('/student/courses')}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow">
                        <BookOpen className="w-4 h-4" /> Browse Courses
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                        <p className="text-gray-500 font-medium">Loading your assignments...</p>
                    </div>
                ) : assignments.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-16 text-center border border-gray-100 dark:border-slate-700 shadow-sm">
                        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white pb-2">No assignments yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8">
                            Enroll in courses to access assignments and track your academic progress.
                        </p>
                        <button onClick={() => navigate('/student/courses')}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 dark:shadow-none">
                            <BookOpen className="w-5 h-5" /> Browse Courses
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {assignments.map(a => {
                            const overdue = isPastDeadline(a.deadline);
                            const isSubmitted = !!a.submission;
                            const isGraded = a.submission?.status === 'graded';

                            return (
                                <div key={a._id} className={`bg-white dark:bg-slate-800 rounded-2xl border shadow-sm transition-all ${isGraded ? 'border-green-100 dark:border-green-900/30' : overdue && !isSubmitted ? 'border-red-100 dark:border-red-900/30' : 'border-gray-100 dark:border-slate-700'}`}>
                                    <div className="p-6 flex flex-col md:flex-row gap-5 items-start">
                                        {/* Icon */}
                                        <div className={`p-4 rounded-2xl flex-shrink-0 ${isGraded ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : overdue && !isSubmitted ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'}`}>
                                            {isGraded ? <Award className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block mb-1">{a.courseName}</span>
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-2">{a.title}</h3>
                                            {a.description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{a.description}</p>}
                                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                                <span className={`flex items-center gap-1 font-medium ${overdue && !isSubmitted ? 'text-red-500' : 'text-gray-500'}`}>
                                                    <Clock className="w-4 h-4" />
                                                    {overdue && !isSubmitted ? 'Overdue: ' : 'Due: '}
                                                    {new Date(a.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="text-gray-400 dark:text-gray-500 font-medium">Max: {a.maxScore} pts</span>
                                            </div>

                                            {/* Grade display */}
                                            {isGraded && (
                                                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/50">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-green-700 dark:text-green-400">
                                                            Score: {a.submission!.grade}/{a.maxScore}
                                                        </span>
                                                        <span className="text-xs font-bold text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">
                                                            {Math.round((a.submission!.grade! / a.maxScore) * 100)}%
                                                        </span>
                                                    </div>
                                                    {a.submission!.feedback && (
                                                        <p className="text-xs text-green-700 dark:text-green-400 mt-2 italic">"{a.submission!.feedback}"</p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Submit form — only if not yet submitted and not past deadline */}
                                            {!isSubmitted && !overdue && (
                                                <div className="mt-4 space-y-2">
                                                    <textarea
                                                        value={textContent[a._id] || ''}
                                                        onChange={e => setTextContent(prev => ({ ...prev, [a._id]: e.target.value }))}
                                                        placeholder="Write your response here..."
                                                        rows={3}
                                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                                                    />
                                                    <button
                                                        onClick={() => handleSubmit(a._id)}
                                                        disabled={submitting === a._id || !(textContent[a._id] || '').trim()}
                                                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition shadow"
                                                    >
                                                        {submitting === a._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                                        {submitting === a._id ? 'Submitting...' : 'Submit Assignment'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status badge */}
                                        <div className="flex-shrink-0">
                                            {isGraded ? (
                                                <span className="flex items-center gap-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Graded
                                                </span>
                                            ) : isSubmitted ? (
                                                <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Submitted
                                                </span>
                                            ) : overdue ? (
                                                <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                    Overdue
                                                </span>
                                            ) : (
                                                <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}

