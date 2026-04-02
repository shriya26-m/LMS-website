import { useEffect, useState } from 'react';
import { Users, BookOpen, Clock, Activity, Settings, ChevronRight, UserPlus, GraduationCap, ShieldCheck } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { usersService } from '../../services/users.service';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, students: 0, instructors: 0, admins: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await usersService.getStats();
                setStats(res.data.data);
            } catch {
                toast.error('Failed to load real-time statistics');
                setStats({ totalUsers: 0, students: 0, instructors: 0, admins: 0 });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const cards = [
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-900/50' },
        { title: 'Students', value: stats.students, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-900/50' },
        { title: 'Instructors', value: stats.instructors, icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-900/50' },
        { title: 'Admins', value: stats.admins, icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-100 dark:border-rose-900/50' },
    ];

    return (
        <Layout title="Platform Control Center">
            <div className="space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Platform Overview</h1>
                        <p className="text-gray-500 font-medium mt-1">Real-time pulse of your learning ecosystem</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                        <Activity className="w-4 h-4" />
                        System Online
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((s, i) => (
                        <div key={i} className={`bg-white dark:bg-slate-800 p-6 rounded-3xl border ${s.border} shadow-sm transition-all hover:shadow-md group`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-4 rounded-2xl ${s.bg} ${s.color} transition-transform group-hover:scale-110`}>
                                    <s.icon className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Now</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{s.title}</h3>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <p className="text-4xl font-black text-gray-900 dark:text-white">
                                        {loading ? <span className="animate-pulse">---</span> : s.value}
                                    </p>
                                    <span className="text-xs font-bold text-emerald-500">+12%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
                                <Activity className="w-32 h-32 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                Platform Growth
                                <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50">Live</span>
                            </h2>
                            <div className="h-[240px] flex items-end gap-3 px-2">
                                {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-gradient-to-t from-indigo-600 to-violet-400 rounded-t-xl transition-all duration-1000 hover:from-indigo-400 hover:to-violet-200 cursor-pointer relative group/bar"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition shadow-xl pointer-events-none">
                                            {h}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                <span>Jan</span>
                                <span>Mar</span>
                                <span>May</span>
                                <span>Jul</span>
                                <span>Sep</span>
                                <span>Nov</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/40 transition-all duration-700" />
                            <h3 className="text-lg font-black uppercase tracking-widest text-indigo-400 mb-6">Quick Actions</h3>
                            <div className="space-y-4">
                                <button
                                    onClick={() => navigate('/admin/users')}
                                    className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition group/btn border border-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold">User Directory</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-white/30 group-hover/btn:translate-x-1 transition" />
                                </button>
                                <button
                                    onClick={() => navigate('/admin/courses')}
                                    className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition group/btn border border-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                            <BookOpen className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold">Course Control</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-white/30 group-hover/btn:translate-x-1 transition" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-white/5 cursor-not-allowed rounded-2xl border border-white/5 opacity-50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-500/20 rounded-lg text-slate-400">
                                            <Settings className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold">Settings</span>
                                    </div>
                                </button>
                            </div>

                            <div className="mt-8 p-6 bg-indigo-600 rounded-3xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-1">Upcoming Maintenance</p>
                                    <h4 className="font-bold text-lg mb-4">Tonight @ 23:00</h4>
                                    <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 bg-white/20 rounded-full w-fit">
                                        <Clock className="w-3.5 h-3.5" />
                                        Estimated: 15 mins
                                    </div>
                                </div>
                                <Activity className="absolute bottom-[-10px] right-[-10px] w-24 h-24 text-white/10 -rotate-12" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
