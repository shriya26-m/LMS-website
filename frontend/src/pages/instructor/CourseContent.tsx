import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Plus,
    ArrowLeft,
    Video,
    FileText,
    Trash2,
    Edit,
    GripVertical,
    Save,
    X,
    Loader2,
    Calendar,
    Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '../../components/layout/Layout';
import { lessonsService } from '../../services/lessons.service';
import { coursesService } from '../../services/courses.service';
import { uploadService } from '../../services/upload.service';
import { assignmentsService } from '../../services/assignments.service';
import type { Course, Lesson, Assignment } from '../../types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

type ActiveTab = 'lessons' | 'assignments';

export default function CourseContent() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<ActiveTab>('lessons');

    // UI State
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form State (Dynamic based on tab)
    const [lessonForm, setLessonForm] = useState({
        title: '',
        description: '',
        videoUrl: '',
        pdfUrl: '',
        isFree: false
    });

    const [assignmentForm, setAssignmentForm] = useState({
        title: '',
        description: '',
        deadline: '',
        maxScore: 100
    });

    useEffect(() => {
        if (id) {
            loadAll();
        }
    }, [id]);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [cRes, lRes, aRes] = await Promise.all([
                coursesService.getById(id!),
                lessonsService.getByCourse(id!),
                assignmentsService.getByCourse(id!)
            ]);
            setCourse(cRes.data.data);
            setLessons(lRes.data.data);
            setAssignments(aRes.data.data);
        } catch (error) {
            toast.error('Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'videoUrl' | 'pdfUrl') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const res = await uploadService.uploadSingle(file);
            setLessonForm(prev => ({ ...prev, [field]: res.data.data.url }));
            toast.success('File uploaded!');
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveLesson = async () => {
        if (!lessonForm.title) return toast.error('Title is required');

        try {
            if (isEditing) {
                await lessonsService.update(isEditing, lessonForm);
                toast.success('Lesson updated!');
            } else {
                await lessonsService.create({ ...lessonForm, courseId: id });
                toast.success('Lesson added!');
            }
            resetForm();
            loadAll();
        } catch (error) {
            toast.error('Failed to save lesson');
        }
    };

    const handleSaveAssignment = async () => {
        if (!assignmentForm.title || !assignmentForm.deadline) return toast.error('Title and Deadline are required');

        try {
            if (isEditing) {
                await assignmentsService.update(isEditing, assignmentForm);
                toast.success('Assignment updated!');
            } else {
                await assignmentsService.create({ ...assignmentForm, courseId: id });
                toast.success('Assignment added!');
            }
            resetForm();
            loadAll();
        } catch (error) {
            toast.error('Failed to save assignment');
        }
    };

    const resetForm = () => {
        setIsAdding(false);
        setIsEditing(null);
        setLessonForm({ title: '', description: '', videoUrl: '', pdfUrl: '', isFree: false });
        setAssignmentForm({ title: '', description: '', deadline: '', maxScore: 100 });
    };

    const handleDelete = async (itemId: string, type: 'lesson' | 'assignment') => {
        if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            if (type === 'lesson') await lessonsService.delete(itemId);
            else await assignmentsService.delete(itemId);
            toast.success(`${type} deleted`);
            loadAll();
        } catch (error) {
            toast.error(`Failed to delete ${type}`);
        }
    };

    const handleOnDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(lessons);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update local state immediately for snappy UI
        setLessons(items);

        try {
            const orders = items.map((l, i) => ({ id: l._id, order: i + 1 }));
            await lessonsService.reorder(id!, orders);
            toast.success('Course order updated');
        } catch (error) {
            toast.error('Failed to sync order with server');
            loadAll(); // Revert on failure
        }
    };

    const startEditing = (item: any) => {
        setIsAdding(true);
        setIsEditing(item._id);
        if (activeTab === 'lessons') {
            setLessonForm({
                title: item.title,
                description: item.description || '',
                videoUrl: item.videoUrl || '',
                pdfUrl: item.pdfUrl || '',
                isFree: item.isFree
            });
        } else {
            setAssignmentForm({
                title: item.title,
                description: item.description || '',
                deadline: item.deadline ? new Date(item.deadline).toISOString().split('T')[0] : '',
                maxScore: item.maxScore || 100
            });
        }
    };

    if (loading) return <Layout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div></Layout>;

    return (
        <Layout title="Course Content Manager">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/instructor/courses')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                    {!isAdding && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow-md"
                        >
                            <Plus className="w-4 h-4" /> Add {activeTab === 'lessons' ? 'Lesson' : 'Assignment'}
                        </button>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
                    <div className="relative z-10">
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{course?.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">Configure your course curriculum and evaluation methods.</p>

                        <div className="flex gap-1 mt-6 bg-gray-50 dark:bg-slate-900/50 p-1 rounded-xl w-fit border border-gray-100 dark:border-slate-700">
                            <button
                                onClick={() => { setActiveTab('lessons'); resetForm(); }}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'lessons' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm border border-gray-100 dark:border-slate-700' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Lessons ({lessons.length})
                            </button>
                            <button
                                onClick={() => { setActiveTab('assignments'); resetForm(); }}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'assignments' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm border border-gray-100 dark:border-slate-700' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Assignments ({assignments.length})
                            </button>
                        </div>
                    </div>
                </div>

                {isAdding && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/30 p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {isEditing ? `Edit ${activeTab === 'lessons' ? 'Lesson' : 'Assignment'}` : `New ${activeTab === 'lessons' ? 'Lesson' : 'Assignment'}`}
                            </h2>
                            <button onClick={resetForm} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                                <input
                                    value={activeTab === 'lessons' ? lessonForm.title : assignmentForm.title}
                                    onChange={e => activeTab === 'lessons' ? setLessonForm({ ...lessonForm, title: e.target.value }) : setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    placeholder={`Enter ${activeTab === 'lessons' ? 'lesson' : 'assignment'} title...`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                                <textarea
                                    value={activeTab === 'lessons' ? lessonForm.description : assignmentForm.description}
                                    onChange={e => activeTab === 'lessons' ? setLessonForm({ ...lessonForm, description: e.target.value }) : setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                    placeholder="Provide details for students..."
                                />
                            </div>

                            {activeTab === 'lessons' ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Video Content</label>
                                            <div className="flex gap-2">
                                                <input
                                                    value={lessonForm.videoUrl}
                                                    onChange={e => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                                    className="flex-1 px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                                    placeholder="Video URL..."
                                                />
                                                <div className="relative">
                                                    <input type="file" onChange={e => handleFileUpload(e, 'videoUrl')} accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                                    <button className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition">
                                                        <Video className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">PDF Materials</label>
                                            <div className="flex gap-2">
                                                <input
                                                    value={lessonForm.pdfUrl}
                                                    onChange={e => setLessonForm({ ...lessonForm, pdfUrl: e.target.value })}
                                                    className="flex-1 px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm"
                                                    placeholder="PDF URL..."
                                                />
                                                <div className="relative">
                                                    <input type="file" onChange={e => handleFileUpload(e, 'pdfUrl')} accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" />
                                                    <button className="px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition">
                                                        <FileText className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox" id="isFree"
                                            checked={lessonForm.isFree}
                                            onChange={e => setLessonForm({ ...lessonForm, isFree: e.target.checked })}
                                            className="w-4 h-4 text-indigo-600 rounded"
                                        />
                                        <label htmlFor="isFree" className="text-sm font-medium text-gray-700 dark:text-gray-300">Free preview</label>
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Deadline</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <input
                                                type="date"
                                                value={assignmentForm.deadline}
                                                onChange={e => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Max Score</label>
                                        <div className="relative">
                                            <Award className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                            <input
                                                type="number"
                                                value={assignmentForm.maxScore}
                                                onChange={e => setAssignmentForm({ ...assignmentForm, maxScore: parseInt(e.target.value) })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3">
                                <button onClick={resetForm} className="px-6 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition">
                                    Cancel
                                </button>
                                <button
                                    onClick={activeTab === 'lessons' ? handleSaveLesson : handleSaveAssignment}
                                    disabled={uploading}
                                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-100 dark:shadow-none"
                                >
                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isEditing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {activeTab === 'lessons' ? (
                        lessons.length === 0 ? (
                            <EmptyState icon={Video} text="No lessons added yet." />
                        ) : (
                            <DragDropContext onDragEnd={handleOnDragEnd}>
                                <Droppable droppableId="lessons">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                            {lessons.map((lesson, idx) => (
                                                <Draggable key={lesson._id} draggableId={lesson._id} index={idx}>
                                                    {(provided) => (
                                                        <ItemCard
                                                            provided={provided}
                                                            innerRef={provided.innerRef}
                                                            idx={idx}
                                                            title={lesson.title}
                                                            onEdit={() => startEditing(lesson)}
                                                            onDelete={() => handleDelete(lesson._id, 'lesson')}
                                                            tags={[
                                                                lesson.videoUrl && { label: 'Video', icon: Video, color: 'text-blue-600', bg: 'bg-blue-50' },
                                                                lesson.pdfUrl && { label: 'PDF', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
                                                                lesson.isFree && { label: 'Free', color: 'text-green-600', bg: 'bg-green-50' }
                                                            ].filter(Boolean) as any}
                                                        />
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        )
                    ) : (
                        assignments.length === 0 ? (
                            <EmptyState icon={Calendar} text="No assignments added yet." />
                        ) : (
                            assignments.map((assignment, idx) => (
                                <ItemCard
                                    key={assignment._id}
                                    idx={idx}
                                    title={assignment.title}
                                    onEdit={() => startEditing(assignment)}
                                    onDelete={() => handleDelete(assignment._id, 'assignment')}
                                    tags={[
                                        { label: `Max ${assignment.maxScore}`, icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
                                        { label: `Due ${new Date(assignment.deadline).toLocaleDateString()}`, icon: Calendar, color: 'text-red-600', bg: 'bg-red-50' }
                                    ]}
                                />
                            ))
                        )
                    )}
                </div>
            </div>
        </Layout>
    );
}

function EmptyState({ icon: Icon, text }: { icon: any, text: string }) {
    return (
        <div className="text-center py-12 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
            <Icon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">{text}</p>
        </div>
    );
}

function ItemCard({ idx, title, tags, onEdit, onDelete, provided, innerRef }: any) {
    return (
        <div
            ref={innerRef}
            {...provided?.draggableProps}
            className="group bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all shadow-indigo-100/10"
        >
            <div
                {...provided?.dragHandleProps}
                className="text-gray-300 cursor-grab active:cursor-grabbing hover:text-indigo-400 transition"
            >
                <GripVertical className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center font-extrabold text-indigo-600 dark:text-indigo-400">
                {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 dark:text-white truncate">{title}</h3>
                <div className="flex items-center gap-3 mt-1.5 overflow-x-auto no-scrollbar">
                    {tags.map((tag: any, i: number) => (
                        <span key={i} className={`flex items-center gap-1.5 text-[10px] uppercase font-black ${tag.color} ${tag.bg} px-2 py-0.5 rounded-md tracking-widest whitespace-nowrap`}>
                            {tag.icon && <tag.icon className="w-3 h-3" />} {tag.label}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition">
                    <Edit className="w-4 h-4" />
                </button>
                <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

