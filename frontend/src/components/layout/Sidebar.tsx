import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    GraduationCap, Home, BookOpen, Users, Settings, LogOut, Menu, X,
    LayoutDashboard, FileText, Award, TrendingUp, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth.service';
import toast from 'react-hot-toast';

interface NavItem {
    label: string;
    path: string;
    icon: React.ElementType;
    roles?: string[];
}

const navItems: NavItem[] = [
    // Admin
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: ['admin'] },
    { label: 'Users', path: '/admin/users', icon: Users, roles: ['admin'] },
    { label: 'All Courses', path: '/admin/courses', icon: BookOpen, roles: ['admin'] },

    // Instructor
    { label: 'Dashboard', path: '/instructor', icon: LayoutDashboard, roles: ['instructor'] },
    { label: 'My Courses', path: '/instructor/courses', icon: BookOpen, roles: ['instructor'] },
    { label: 'Submissions', path: '/instructor/submissions', icon: FileText, roles: ['instructor'] },

    // Student
    { label: 'Dashboard', path: '/student', icon: Home, roles: ['student'] },
    { label: 'Browse Courses', path: '/student/courses', icon: BookOpen, roles: ['student'] },
    { label: 'My Progress', path: '/student/progress', icon: TrendingUp, roles: ['student'] },
    { label: 'Assignments', path: '/student/assignments', icon: FileText, roles: ['student'] },
    { label: 'Certificates', path: '/student/certificates', icon: Award, roles: ['student'] },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const filteredNav = navItems.filter(item => !item.roles || item.roles.includes(user?.role || ''));

    const handleLogout = async () => {
        try { await authService.logout(); } catch { /* ignore */ }
        logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const isActive = (path: string) => {
        if (path === '/admin' || path === '/instructor' || path === '/student') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <aside className={`${collapsed ? 'w-20' : 'w-64'} min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col transition-all duration-300 shadow-2xl`}>
            {/* Logo */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                {!collapsed && (
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            LearnHub
                        </span>
                    </Link>
                )}
                <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-white/10 transition ml-auto">
                    {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </button>
            </div>

            {/* User info */}
            {!collapsed && user && (
                <div className="px-4 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center font-bold text-lg shadow-md">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{user.name || 'User'}</p>
                            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {filteredNav.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${active
                                ? 'bg-gradient-to-r from-indigo-600/60 to-purple-600/40 text-white shadow-lg border border-white/10'
                                : 'text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-indigo-300' : ''}`} />
                            {!collapsed && (
                                <>
                                    <span className="text-sm font-medium flex-1">{item.label}</span>
                                    {active && <ChevronRight className="w-4 h-4 text-indigo-400" />}
                                </>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="p-3 border-t border-white/10 space-y-1">
                <Link to="/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition">
                    <Settings className="w-5 h-5" />
                    {!collapsed && <span className="text-sm font-medium">Settings</span>}
                </Link>
                <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition">
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span className="text-sm font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
