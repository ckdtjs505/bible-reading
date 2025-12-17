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

export default function SchedulePage() {
    const searchParams = useSearchParams();
    const year = searchParams?.get('year') || '2026';

    const [schedule, setSchedule] = useState<PlanItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

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

    const handleAddRow = () => {
        const lastItem = schedule[schedule.length - 1];
        const newIndex = lastItem ? String(Number(lastItem.index) + 1) : "1";
        const newDayCount = lastItem ? String(Number(lastItem.daycount) + 1) : "1";

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
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">Index</th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">DayCnt</th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Date</th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">Lang</th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">Book</th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">Start</th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">End</th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Image URL</th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Video ID</th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {schedule.map((item) => (
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
