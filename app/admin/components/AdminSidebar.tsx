'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

const MENU_ITEMS = [
    {
        name: 'HOME',
        path: '/admin',
        exact: true,
    },
    {
        name: '2025 함온성 일정',
        path: '/admin/schedule',
        year: '2025',
    },
    {
        name: '2026 함온성 일정',
        path: '/admin/schedule',
        year: '2026',
    },
    {
        name: '진행 현황',
        path: '/admin/status',
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 라우트 변경 시 모바일 메뉴 닫기
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname, searchParams]);

    const isLinkActive = (itemPath: string, itemYear?: string, exact?: boolean) => {
        if (exact) {
            return pathname === itemPath;
        }
        if (itemYear) {
            return pathname === itemPath && searchParams?.get('year') === itemYear;
        }
        return pathname === itemPath;
    };

    const NavLinks = () => (
        <nav className="space-y-1">
            {MENU_ITEMS.map((item) => {
                const active = isLinkActive(item.path, item.year, item.exact);
                const href = item.year ? `${item.path}?year=${item.year}` : item.path;

                return (
                    <Link
                        key={item.name}
                        href={href}
                        className={`block px-6 py-3 text-sm font-medium transition-colors duration-200 rounded-lg mx-2 ${active
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* 모바일 헤더 */}
            <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
                <h2 className="text-xl font-bold text-gray-800">Admin</h2>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    type="button"
                    className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md p-2"
                >
                    <span className="sr-only">Open sidebar</span>
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"}
                        />
                    </svg>
                </button>
            </header>

            {/* 모바일 사이드바 (오버레이) */}
            {isMobileMenuOpen && (
                <div className="relative z-40 md:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>

                    <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white pb-4 shadow-xl">
                        <div className="flex px-4 pt-5 pb-2 justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Admin</h2>
                            <button
                                type="button"
                                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 focus:outline-none hover:text-gray-500"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close sidebar</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-2 py-4">
                            <NavLinks />
                        </div>
                    </div>
                </div>
            )}

            {/* 데스크탑 사이드바 */}
            <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-200">
                <div className="flex flex-col flex-grow pt-5">
                    <div className="flex items-center flex-shrink-0 px-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Admin</h2>
                    </div>
                    <div className="flex-1 flex flex-col px-2 pb-4 overflow-y-auto">
                        <NavLinks />
                    </div>
                    {/* 선택 사항: 사용자 정보 또는 하단 로그아웃 */}
                    <div className="p-4 border-t border-gray-200">
                        <Link href="/" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                            Exit Admin
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
