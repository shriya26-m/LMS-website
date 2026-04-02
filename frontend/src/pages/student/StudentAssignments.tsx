import { useState, useEffect } from 'react';
import { FileText, Upload, CheckCircle, Clock } from 'lucide-react';
import Layout from '../../components/layout/Layout';

export default function StudentAssignments() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                // In a real app we'd fetch course assignments, here we simulate an endpoint
                setAssignments([
                    { _id: '1', title: 'Build a REST API', course: 'Node.js Backend', deadline: new Date(Date.now() + 86400000 * 5).toISOString(), status: 'pending', totalMarks: 100 },
                    { _id: '2', title: 'React Hooks Project', course: 'React Masterclass', deadline: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'submitted', grade: 95, totalMarks: 100 }
                ]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <Layout title="Assignments">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Assignments</h1>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-32 bg-white dark:bg-slate-800 rounded-2xl" />)}
                    </div>
                ) : assignments.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-slate-700">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white pb-2">No assignments due</h3>
                        <p className="text-gray-500">You're all caught up on your coursework!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {assignments.map((a: any) => (
                            <div key={a._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <div className="flex-1 w-full relative">
                                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1 block">{a.course}</span>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-2">{a.title}</h3>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1 text-gray-500">
                                            <Clock className="w-4 h-4" /> Due: {new Date(a.deadline).toLocaleDateString()}
                                        </span>
                                        <span className="text-gray-500 font-medium">Max Marks: {a.totalMarks}</span>
                                    </div>
                                </div>

                                <div className="w-full md:w-48 text-right flex flex-col items-end gap-2">
                                    {a.status === 'pending' ? (
                                        <>
                                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Pending</span>
                                            <button className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow">
                                                <Upload className="w-4 h-4" /> Submit Work
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 flex items-center gap-1 rounded-full uppercase tracking-wider"><CheckCircle className="w-3.5 h-3.5" /> Submitted</span>
                                            <div className="mt-2 text-center bg-gray-50 dark:bg-slate-700 px-4 py-2 rounded-xl w-full">
                                                <span className="block text-xs text-gray-500 uppercase font-semibold">Grade</span>
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">{a.grade}/{a.totalMarks}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
