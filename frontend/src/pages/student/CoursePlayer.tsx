import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    PlayCircle,
    FileText,
    CheckCircle,
    ChevronRight,
    ChevronLeft,
    Menu,
    X,
    Loader2,
    Calendar,
    Award,
    Send,
    Video
} from 'lucide-react';
import toast from 'react-hot-toast';
import { lessonsService } from '../../services/lessons.service';
import { coursesService } from '../../services/courses.service';
import { progressService } from '../../services/progress.service';
import { assignmentsService, submissionsService } from '../../services/assignments.service';
import type { Course, Lesson, Assignment, Progress } from '../../types';

export default function CoursePlayer() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [progress, setProgress] = useState<Progress | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'content' | 'assignments'>('content');

    // Submission state
    const [submitting, setSubmitting] = useState(false);
    const [textContent, setTextContent] = useState('');

    useEffect(() => {
        if (id) loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [cRes, lRes, aRes, pRes] = await Promise.all([
                coursesService.getById(id!),
                lessonsService.getByCourse(id!),
                assignmentsService.getByCourse(id!),
                progressService.getByCourse(id!)
            ]);

            setCourse(cRes.data.data);
            const sortedLessons = lRes.data.data.sort((a, b) => a.order - b.order);
            setLessons(sortedLessons);
            setAssignments(aRes.data.data);
            setProgress(pRes.data.data);

            if (sortedLessons.length > 0) {
                setCurrentLesson(sortedLessons[0]);
            }
        } catch (error) {
            toast.error('Failed to load course content');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkComplete = async (lessonId: string) => {
        try {
            await progressService.markComplete(id!, lessonId);
            const pRes = await progressService.getByCourse(id!);
            setProgress(pRes.data.data);
            toast.success('Progress updated!');
        } catch (error) {
            toast.error('Failed to update progress');
        }
    };

    const handleSubmitAssignment = async (assignmentId: string) => {
        if (!textContent.trim()) return toast.error('Please enter your response');
        setSubmitting(true);
        try {
            await submissionsService.submit({ assignmentId, textContent });
            toast.success('Assignment submitted successfully!');
            setTextContent('');
        } catch (error) {
            toast.error('Failed to submit assignment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-950">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
    );

    const isCompleted = (lessonId: string) => progress?.completedLessons.includes(lessonId);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900 dark:text-white truncate pr-4">{course?.title}</h2>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Curriculum</h3>
                            <div className="space-y-1">
                                {lessons.map((lesson, idx) => (
                                    <button
                                        key={lesson._id}
                                        onClick={() => { setCurrentLesson(lesson); setActiveTab('content'); }}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${currentLesson?._id === lesson._id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800' : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400'}`}
                                    >
                                        <div className="relative">
                                            {isCompleted(lesson._id) ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${currentLesson?._id === lesson._id ? 'border-indigo-600' : 'border-gray-300'}`}>
                                                    {idx + 1}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{lesson.title}</p>
                                            <p className="text-[10px] text-gray-400">Lesson {idx + 1}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {assignments.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Evaluations</h3>
                                <div className="space-y-1">
                                    {assignments.map((assignment) => (
                                        <button
                                            key={assignment._id}
                                            onClick={() => { setActiveTab('assignments'); setCurrentLesson(null); }}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeTab === 'assignments' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800' : 'hover:bg-gray-50 dark:hover:hover:bg-slate-800 text-gray-600 dark:text-gray-400'}`}
                                        >
                                            <Award className="w-5 h-5" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">{assignment.title}</p>
                                                <p className="text-[10px] text-gray-400">Assignment</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Your Progress</span>
                            <span className="text-xs font-bold text-indigo-600">{progress?.progressPercent || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress?.progressPercent || 0}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Player Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-4 flex items-center justify-between z-40">
                    <button onClick={() => setSidebarOpen(true)} className={`${sidebarOpen ? 'lg:hidden' : 'flex'} p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg mr-4`}>
                        <Menu className="w-5 h-5 text-gray-500" />
                    </button>

                    <button onClick={() => navigate('/student/courses')} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition">
                        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
                    </button>

                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-500 hover:text-indigo-600 transition">
                            <span className="text-xs font-bold bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md uppercase tracking-wider">{course?.level}</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 p-6 md:p-10">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {activeTab === 'content' && currentLesson ? (
                            <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
                                {/* Video Player Placeholder / Implementation */}
                                <div className="aspect-video w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group">
                                    {currentLesson.videoUrl ? (
                                        <video
                                            src={currentLesson.videoUrl}
                                            controls
                                            className="w-full h-full object-contain"
                                            poster={course?.thumbnail}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                            <Video className="w-16 h-16 mb-4 opacity-20" />
                                            <p className="text-lg font-medium">No video content for this lesson</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-8">
                                    <div>
                                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{currentLesson.title}</h1>
                                        <div className="flex items-center gap-3 mt-2">
                                            {currentLesson.pdfUrl && (
                                                <a href={currentLesson.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full hover:bg-orange-100 transition">
                                                    <FileText className="w-4 h-4" /> View PDF Materials
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    {!isCompleted(currentLesson._id) && (
                                        <button
                                            onClick={() => handleMarkComplete(currentLesson._id)}
                                            className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition shadow-lg shadow-green-100 dark:shadow-none"
                                        >
                                            <CheckCircle className="w-5 h-5" /> Mark as Completed
                                        </button>
                                    )}
                                </div>

                                <div className="mt-8">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About this lesson</h2>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                                        {currentLesson.description || "No description provided for this lesson."}
                                    </p>
                                </div>
                            </div>
                        ) : activeTab === 'assignments' && assignments.length > 0 ? (
                            <div className="animate-in fade-in duration-500 slide-in-from-bottom-4 space-y-8">
                                {assignments.map(assignment => (
                                    <div key={assignment._id} className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-purple-900/30 p-8 shadow-xl shadow-purple-500/5">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-2xl">
                                                    <Award className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{assignment.title}</h2>
                                                    <p className="text-sm text-gray-500">Maximum Score: {assignment.maxScore} points</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
                                                <Calendar className="w-4 h-4" /> Due {new Date(assignment.deadline).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="prose dark:prose-invert max-w-none mb-8">
                                            <h3 className="text-lg font-bold">Instructions</h3>
                                            <p className="text-gray-600 dark:text-gray-400">{assignment.description}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-sm font-bold text-gray-900 dark:text-white">Your Submission</label>
                                            <textarea
                                                value={textContent}
                                                onChange={e => setTextContent(e.target.value)}
                                                placeholder="Write your response here..."
                                                rows={8}
                                                className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 outline-none transition"
                                            />
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleSubmitAssignment(assignment._id)}
                                                    disabled={submitting}
                                                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition shadow-lg shadow-indigo-100 dark:shadow-none"
                                                >
                                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                                    Submit Assignment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <PlayCircle className="w-16 h-16 text-gray-200 mb-4" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select a lesson to start learning</h2>
                                <p className="text-gray-500 mt-1">Use the sidebar to navigate through the course content.</p>
                            </div>
                        )}
                    </div>
                </main>

                {/* Footer Controls */}
                <footer className="h-16 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 px-6 flex items-center justify-between z-40">
                    <button
                        disabled={lessons.indexOf(currentLesson!) <= 0}
                        onClick={() => setCurrentLesson(lessons[lessons.indexOf(currentLesson!) - 1])}
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 disabled:opacity-30 transition"
                    >
                        <ChevronLeft className="w-5 h-5" /> Previous Lesson
                    </button>

                    <button
                        disabled={lessons.indexOf(currentLesson!) === lessons.length - 1}
                        onClick={() => setCurrentLesson(lessons[lessons.indexOf(currentLesson!) + 1])}
                        className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-30 transition"
                    >
                        Next Lesson <ChevronRight className="w-5 h-5" />
                    </button>
                </footer>
            </div>
        </div>
    );
}
