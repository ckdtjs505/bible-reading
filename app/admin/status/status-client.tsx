"use client";

import { useState } from "react";
import Link from "next/link";

interface StatusData {
    name: string;
    completedDays: number[]; // 완료된 일차 배열
    totalCount: number;
    lastActive: string;
}

interface AdminStatusClientProps {
    statusData: StatusData[];
    maxDay: number; // 현재 최대 일차 (예: 50)
}

export default function AdminStatusClient({ statusData, maxDay }: AdminStatusClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAllDays, setShowAllDays] = useState(false);

    // 유저 필터링
    const filteredUsers = statusData.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 표시할 일차 결정
    // 기본값: 1일차부터 시작해서 rangeSize 만큼.
    // 전체 보기 시: 1일차부터 maxDay까지.

    // 표시할 일차 배열 생성
    // 1..N (오름차순)으로 변경 (1일차부터 시작)

    const rangeSize = 30;
    const isFullRange = showAllDays;

    // 1일차부터 시작하는 로직
    const startDay = 1;
    // 전체 보기가 아니면 rangeSize만큼 (최대 maxDay까지)
    const endDay = isFullRange ? maxDay : Math.min(maxDay, rangeSize);

    // 일차 헤더 생성 (오름차순: 1일차부터)
    const displayDays: number[] = [];
    for (let d = startDay; d <= endDay; d++) {
        displayDays.push(d);
    }

    return (
        <div className="p-4 max-w-full overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">📊 진행 현황표</h1>
                    <p className="text-sm text-gray-500">각 멤버별 일차별 진행 여부를 확인합니다.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin" className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium">
                        대시보드로 돌아가기
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="이름 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={showAllDays}
                                onChange={(e) => setShowAllDays(e.target.checked)}
                                className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            전체 기간 보기 (Day 1 ~ {maxDay})
                        </label>
                    </div>
                </div>

                {/* Status Table */}
                <div className="overflow-auto pb-2 max-h-[calc(100vh-250px)] border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="sticky left-0 top-0 z-30 bg-gray-50 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32 border-r border-b border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                    이름 ({filteredUsers.length})
                                </th>
                                <th scope="col" className="sticky top-0 z-20 px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider bg-yellow-50 border-b border-gray-200 min-w-[60px]">
                                    참여율
                                </th>
                                {displayDays.map(day => (
                                    <th key={day} scope="col" className="sticky top-0 z-20 px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 min-w-[40px]">
                                        {day}일
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => {
                                // 참여율 계산 (소수점 둘째자리까지)
                                const rateStr = ((user.completedDays.length / maxDay) * 100).toFixed(2);
                                const rateNum = Number(rateStr);

                                return (
                                    <tr key={user.name} className="hover:bg-gray-50">
                                        <td className="sticky left-0 z-10 bg-white px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                            {user.name}
                                        </td>
                                        <td className="px-3 py-3 whitespace-nowrap text-center text-xs text-gray-600 bg-yellow-50/50">
                                            <span className={`font-bold ${rateNum >= 80 ? 'text-green-600' : rateNum >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                                                {rateStr}%
                                            </span>
                                            <div className="text-[10px] text-gray-400">
                                                {user.completedDays.length}/{maxDay}
                                            </div>
                                        </td>
                                        {displayDays.map(day => {
                                            const isCompleted = user.completedDays.includes(day);
                                            return (
                                                <td key={day} className="px-2 py-3 whitespace-nowrap text-center text-sm border-l border-dotted border-gray-100">
                                                    {isCompleted ? (
                                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 font-bold text-xs">
                                                            ✓
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-200 text-xs">·</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
