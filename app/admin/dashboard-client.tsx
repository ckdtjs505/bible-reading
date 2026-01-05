"use client";

import { useState } from "react";

type ReadingStatus = {
    Timestamp: string;
    name: string;
    daycnt: string;
    myMessage: string;
    pray: string;
}[];

interface AdminDashboardClientProps {
    currentDaycount: number;
    todayCount: number;
    totalSubmissions: number;
    uniqueMembersCount: number;
    dailyStats: { day: number; count: number; names: string[]; topVerses: { ref: string; count: number }[] }[];
    memberStats: { name: string; count: number; lastActive: string }[];
    verseStats: { ref: string; count: number }[];
    keywordStats: { word: string; count: number }[];
    allLogs: ReadingStatus; // Pass all logs for filtering
    errorMsg: string;
}

function NameList({ names }: { names: string[] }) {
    const [expanded, setExpanded] = useState(false);
    const LIMIT = 20;

    if (names.length <= LIMIT) {
        return (
            <div className="flex flex-wrap gap-1">
                {names.map((name, i) => (
                    <span key={`${name}-${i}`} className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500 border border-gray-200">
                        {name}
                    </span>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-wrap gap-1">
                {(expanded ? names : names.slice(0, LIMIT)).map((name, i) => (
                    <span key={`${name}-${i}`} className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500 border border-gray-200">
                        {name}
                    </span>
                ))}
                {!expanded && (
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-600 border border-blue-100 font-medium">
                        +{names.length - LIMIT}명...
                    </span>
                )}
            </div>
            <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-stone-500 hover:text-stone-700 mt-1.5 underline decoration-stone-300 underline-offset-2 transition-colors"
            >
                {expanded ? '▲ 접기' : '▼ 전체 명단 보기'}
            </button>
        </div>
    );
}

export default function AdminDashboardClient({
    currentDaycount,
    todayCount,
    totalSubmissions,
    uniqueMembersCount,
    dailyStats,
    memberStats,
    verseStats,
    keywordStats,
    allLogs,
    errorMsg
}: AdminDashboardClientProps) {
    const [selectedVerse, setSelectedVerse] = useState<string | null>(null);

    // Filter logs based on selected verse
    const filteredLogs = selectedVerse
        ? allLogs.filter(log => {
            if (!log.myMessage) return false;

            // 1. Simple Case: Exact match
            if (log.myMessage.includes(selectedVerse)) return true;

            // 2. Flexible Match (Handle formatting differences like "1:1" vs "1장 1절")
            try {
                // selectedVerse format is strictly "Book Chapter:Verse[-EndVerse]" e.g., "창세기 1:1", "창세기 1:1-5"
                const parts = selectedVerse.split(' ');
                if (parts.length < 2) return false;

                const book = parts[0];
                const ref = parts[1]; // "1:1" or "1:1-5"

                // If book is not in message, skip
                if (!log.myMessage.includes(book)) return false;

                // Parse ref numbers
                const [start] = ref.split('-');
                const [ch, v] = start.split(':');

                // Construct regex: Chapter + separator + Verse
                // Matches: "1:1", "1 : 1", "1장 1절", "1장1절"
                // EXCLUDES: "1:17" when searching for "1:1" (by ensuring no digit follows)
                const pattern = new RegExp(`${ch}\\s*[:장]\\s*${v}(?!\\d)`);
                return pattern.test(log.myMessage);
            } catch {
                return false;
            }
        })
        : allLogs.slice(0, 50); // Default to top 50 recent if no filter

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">오늘 진행 (Day {currentDaycount})</p>
                        <h3 className="text-3xl font-bold text-blue-600">{todayCount}명</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">총 누적 제출</p>
                        <h3 className="text-3xl font-bold text-emerald-600">{totalSubmissions.toLocaleString()}건</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">총 참여 멤버</p>
                        <h3 className="text-3xl font-bold text-indigo-600">{uniqueMembersCount}명</h3>
                    </div>
                </div>
            </div>

            {errorMsg && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded">{errorMsg}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Left Column: Daily Stats with Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[800px] col-span-1 lg:col-span-1">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">📅 일차별 현황 & 주요 말씀</h2>
                        {selectedVerse && (
                            <button
                                onClick={() => setSelectedVerse(null)}
                                className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded transition-colors"
                            >
                                필터 해제 ✕
                            </button>
                        )}
                    </div>
                    <div className="overflow-y-auto flex-1 p-0">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 bg-gray-50">일차</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 bg-gray-50">인원</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">주요 묵상 구절 (Top 3)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {dailyStats.map((stat) => (
                                    <tr key={stat.day} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 align-top">{stat.day}일차</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 align-top">{stat.count}명</td>
                                        <td className="px-4 py-4 text-sm text-gray-500 align-top">
                                            {stat.topVerses && stat.topVerses.length > 0 ? (
                                                <div className="flex flex-col gap-1 mb-3">
                                                    {stat.topVerses.map((v, i) => (
                                                        <div
                                                            key={i}
                                                            className={`flex items-center justify-between text-xs px-2 py-1 rounded cursor-pointer transition-colors border ${selectedVerse === v.ref
                                                                ? 'bg-purple-100 text-purple-700 font-bold border-purple-200'
                                                                : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                                                                }`}
                                                            onClick={() => setSelectedVerse(selectedVerse === v.ref ? null : v.ref)}
                                                        >
                                                            <span>{i + 1}. {v.ref}</span>
                                                            <span className="text-gray-400 ml-2 font-normal">{v.count}회</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-300 mb-3 ml-1">-</div>
                                            )}

                                            <div className="pt-3 border-t border-dashed border-gray-100">
                                                <p className="text-[10px] text-gray-400 mb-1.5 font-medium">참여 명단 ({stat.names.length})</p>
                                                <NameList names={stat.names} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Key Metrics (Rankings, Verses, Keywords) */}
                <div className="flex flex-col gap-6 h-[800px]">
                    {/* Rankings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-1/3">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">🏆 멤버별 참여 순위</h2>
                        </div>
                        <div className="overflow-y-auto flex-1 p-0">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">순위</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">횟수</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {memberStats.map((member, idx) => (
                                        <tr key={member.name} className="hover:bg-gray-50">
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 font-medium">{idx + 1}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                                            <td className="px-6 py-2 whitespace-nowrap text-sm text-blue-600 font-bold">{member.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Overall Top Verses */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-1/3">
                        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-sm font-bold text-gray-800">📖 전체 빈출 성경 구절 (Top 10)</h2>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            {verseStats.length > 0 ? (
                                <div className="space-y-2">
                                    {verseStats.map((item, idx) => (
                                        <div
                                            key={item.ref}
                                            onClick={() => setSelectedVerse(item.ref === selectedVerse ? null : item.ref)}
                                            className={`flex items-center justify-between text-xs px-2 py-1.5 rounded cursor-pointer transition-colors ${selectedVerse === item.ref ? 'bg-purple-100 text-purple-700 font-bold' : 'bg-gray-50 hover:bg-gray-100'}`}
                                        >
                                            <span className="flex-1 truncate">{idx + 1}. {item.ref}</span>
                                            <span className="text-gray-500 ml-2">{item.count}회</span>
                                            <div className="w-16 h-1.5 bg-gray-200 rounded-full ml-2">
                                                <div
                                                    className="h-1.5 rounded-full bg-purple-400"
                                                    style={{ width: `${(item.count / verseStats[0].count) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center text-xs">데이터 없음</p>
                            )}
                        </div>
                    </div>

                    {/* Keywords Trend */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-1/3">
                        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-sm font-bold text-gray-800">☁️ Top 묵상 키워드</h2>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            {keywordStats.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {keywordStats.map((item, idx) => (
                                        <span
                                            key={item.word}
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${idx < 3 ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {item.word}
                                            <span className="ml-1 opacity-60">({item.count})</span>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center text-xs">데이터 없음</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Recent Logs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">
                        {selectedVerse ? `🔎 '${selectedVerse}' 관련 제출 기록` : '📝 최근 제출 기록 (최신 50건)'}
                    </h2>
                    {selectedVerse && (
                        <span className="text-sm text-purple-600 font-medium">
                            총 {filteredLogs.length}건 발견
                        </span>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">시간</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">이름</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">일차</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">묵상 내용</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기도 제목</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map((log, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                            {log.Timestamp}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {log.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">Day {log.daycnt}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 min-w-[200px] max-w-xs break-words">
                                            {selectedVerse ? (
                                                <span>
                                                    {log.myMessage.split(selectedVerse).map((part, i, arr) => (
                                                        <span key={i}>
                                                            {part}
                                                            {i < arr.length - 1 && <span className="bg-yellow-200 font-bold text-gray-900 px-0.5 rounded">{selectedVerse}</span>}
                                                        </span>
                                                    ))}
                                                </span>
                                            ) : (
                                                log.myMessage
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 min-w-[200px] max-w-xs break-words">
                                            {log.pray}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        해당 구절이 포함된 기록이 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
