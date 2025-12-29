'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

type PlanItem = {
    index: string;
    daycount: string;
    date: string;
    lang: string;
    book: string;
    start: string;
    end: string;
    img: string;
    videoId: string;
};

import { Suspense } from 'react';

function ScheduleContent() {
    const searchParams = useSearchParams();
    const year = searchParams?.get('year') || '2026';

    const [schedule, setSchedule] = useState<PlanItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    type SortConfig = {
        key: keyof PlanItem;
        direction: 'asc' | 'desc';
    };
    const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'index', direction: 'asc' });

    // Fetch initial data
    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/admin/schedule?year=${year}`)
            .then((res) => res.json())
            .then((data) => {
                setSchedule(Array.isArray(data) ? data : []);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setMessage('Failed to load schedule');
                setIsLoading(false);
            });
    }, [year]);

    const handleSort = (key: keyof PlanItem) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedSchedule = [...schedule].sort((a, b) => {
        if (!sortConfig) return 0;

        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle numeric sorting for index and daycount
        if (sortConfig.key === 'index' || sortConfig.key === 'daycount') {
            return sortConfig.direction === 'asc'
                ? Number(aValue) - Number(bValue)
                : Number(bValue) - Number(aValue);
        }

        // Default string sorting
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleAddRow = () => {
        // Find the max index from all items, not just the last one (since they might be sorted alphabetically)
        const maxIndex = schedule.reduce((max, item) => {
            const current = Number(item.index);
            return current > max ? current : max;
        }, 0);

        const newIndex = String(maxIndex + 1);

        // Find the max daycount as well for consistency
        const maxDayCount = schedule.reduce((max, item) => {
            const current = Number(item.daycount);
            return current > max ? current : max;
        }, 0);
        const newDayCount = String(maxDayCount + 1);

        // Find the item with the max index to use as the previous item (for copying book, date, etc.)
        const lastItem = schedule.find((item) => Number(item.index) === maxIndex);

        // Auto-increment date if possible
        let newDate = "";
        if (lastItem && lastItem.date) {
            const dateObj = new Date(lastItem.date);
            dateObj.setDate(dateObj.getDate() + 1);
            newDate = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
        }

        setSchedule([
            ...schedule,
            {
                index: newIndex,
                daycount: newDayCount,
                date: newDate,
                lang: "kor", // default
                book: lastItem ? lastItem.book : "창세기",
                start: "",
                end: "",
                img: "", // default empty or placeholder
                videoId: lastItem ? lastItem.videoId : ""
            }
        ]);
    };

    const handleRemoveRow = (index: string) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            setSchedule(schedule.filter((item) => item.index !== index));
        }
    };

    const handleChange = (index: string, field: keyof PlanItem, value: string) => {
        setSchedule(
            schedule.map((item) =>
                item.index === index ? { ...item, [field]: value } : item
            )
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');
        try {
            const res = await fetch('/api/admin/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ year, data: schedule }),
            });

            if (res.ok) {
                setMessage('저장되었습니다.');
                setTimeout(() => setMessage(''), 3000);
            } else {
                const errorData = await res.json();
                setMessage('저장 실패: ' + (errorData.message || '알 수 없는 오류'));
            }
        } catch (err) {
            console.error(err);
            setMessage('오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-4">Loading...</div>;

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{year} 함온성 일정 관리</h1>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {isSaving ? '저장 중...' : '저장하기'}
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-2 rounded ${message.includes('실패') || message.includes('오류') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <div className="bg-white rounded shadow overflow-x-auto w-full">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th onClick={() => handleSort('index')} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] cursor-pointer hover:bg-gray-100">
                                Index {sortConfig?.key === 'index' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('daycount')} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] cursor-pointer hover:bg-gray-100">
                                DayCnt {sortConfig?.key === 'daycount' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('date')} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] cursor-pointer hover:bg-gray-100">
                                Date {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('lang')} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] cursor-pointer hover:bg-gray-100">
                                Lang {sortConfig?.key === 'lang' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('book')} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px] cursor-pointer hover:bg-gray-100">
                                Book {sortConfig?.key === 'book' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('start')} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] cursor-pointer hover:bg-gray-100">
                                Start {sortConfig?.key === 'start' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('end')} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px] cursor-pointer hover:bg-gray-100">
                                End {sortConfig?.key === 'end' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('img')} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] cursor-pointer hover:bg-gray-100">
                                Image URL {sortConfig?.key === 'img' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('videoId')} className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] cursor-pointer hover:bg-gray-100">
                                Video ID {sortConfig?.key === 'videoId' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedSchedule.map((item) => (
                            <tr key={item.index}>
                                <td className="px-2 py-2">
                                    <input
                                        type="text"
                                        value={item.index}
                                        onChange={(e) => handleChange(item.index, 'index', e.target.value)}
                                        className="border border-gray-300 rounded px-1 py-1 w-full text-sm"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        type="text"
                                        value={item.daycount}
                                        onChange={(e) => handleChange(item.index, 'daycount', e.target.value)}
                                        className="border border-gray-300 rounded px-1 py-1 w-full text-sm"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        type="text"
                                        value={item.date}
                                        onChange={(e) => handleChange(item.index, 'date', e.target.value)}
                                        className="border border-gray-300 rounded px-1 py-1 w-full text-sm"
                                        placeholder="YYYY-M-D"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        type="text"
                                        value={item.lang}
                                        onChange={(e) => handleChange(item.index, 'lang', e.target.value)}
                                        className="border border-gray-300 rounded px-1 py-1 w-full text-sm"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        type="text"
                                        value={item.book}
                                        onChange={(e) => handleChange(item.index, 'book', e.target.value)}
                                        className="border border-gray-300 rounded px-1 py-1 w-full text-sm"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        type="text"
                                        value={item.start}
                                        onChange={(e) => handleChange(item.index, 'start', e.target.value)}
                                        className="border border-gray-300 rounded px-1 py-1 w-full text-sm"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        type="text"
                                        value={item.end}
                                        onChange={(e) => handleChange(item.index, 'end', e.target.value)}
                                        className="border border-gray-300 rounded px-1 py-1 w-full text-sm"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        type="text"
                                        value={item.img}
                                        onChange={(e) => handleChange(item.index, 'img', e.target.value)}
                                        className="border border-gray-300 rounded px-1 py-1 w-full text-sm"
                                    />
                                </td>
                                <td className="px-2 py-2">
                                    <input
                                        type="text"
                                        value={item.videoId}
                                        onChange={(e) => handleChange(item.index, 'videoId', e.target.value)}
                                        className="border border-gray-300 rounded px-1 py-1 w-full text-sm"
                                    />
                                </td>
                                <td className="px-2 py-2 text-center">
                                    <button
                                        onClick={() => handleRemoveRow(item.index)}
                                        className="text-red-600 hover:text-red-900 text-sm whitespace-nowrap"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {schedule.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                        일정이 없습니다.
                    </div>
                )}

                <div className="p-4 border-t bg-gray-50">
                    <button
                        onClick={handleAddRow}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                        <span className="text-xl mr-1">+</span> 일정 추가
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SchedulePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ScheduleContent />
        </Suspense>
    );
}
