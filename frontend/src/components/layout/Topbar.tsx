import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Moon, Sun, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface TopbarProps {
    title?: string;
}

export default function Topbar({ title }: TopbarProps) {
    const { user } = useAuthStore();
    const [isDark, setIsDark] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Close notification dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm">
            <div className="px-6 py-3 flex items-center justify-between">
                <div>
                    {title && <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>}
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text" placeholder="Search..."
                            className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52 transition dark:text-white dark:placeholder-slate-400"
                        />
                    </div>

                    {/* Dark mode */}
                    <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition text-gray-600 dark:text-gray-300">
                        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition text-gray-600 dark:text-gray-300">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden z-50">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                    <button onClick={() => setShowNotifications(false)}>
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                                <div className="p-4 text-sm text-gray-500 text-center py-8">
                                    🎉 You're all caught up!
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User avatar */}
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow">
                            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {user?.name || user?.email}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
