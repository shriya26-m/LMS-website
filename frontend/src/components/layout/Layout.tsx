import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar title={title} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
