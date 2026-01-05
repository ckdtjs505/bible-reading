import { ReactNode } from 'react';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />

            {/* Main Content */}
            <main className="md:pl-64 transition-all duration-300">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
