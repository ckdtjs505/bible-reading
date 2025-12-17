import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* LNB (Left Navigation Bar) */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800">Admin</h2>
                </div>
                <nav className="mt-6">
                    <Link
                        href="/admin"
                        className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    >
                        HOME
                    </Link>
                    <Link
                        href="/admin/schedule?year=2025"
                        className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    >
                        2025 함온성 일정
                    </Link>
                    <Link
                        href="/admin/schedule?year=2026"
                        className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    >
                        2026 함온성 일정
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
