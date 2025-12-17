
const OPENSHEET = "https://opensheet.elk.sh";
const KEY = "1LrUC8zEKsmAgi7pIeWUIQR8ufOd0F0nGI65ix7UMXr8";
const param = "%ED%95%A8%EC%98%A8%EC%84%B1DB";

type ReadingStatus = {
    Timestamp: string;
    name: string;
    daycnt: string;
    myMessage: string;
    pray: string;
}[];

const getHamonDB = async (): Promise<ReadingStatus> => {
    const response = await fetch(`${OPENSHEET}/${KEY}/${param}`, {
        cache: 'no-store', // Always fetch fresh data
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
    });

    if (!response.ok) {
        throw Error("response error");
    }

    return await response.json();
};

export default async function AdminDashboard() {
    // Fetch today's plan from the API via absolute URL (server-side)
    // In production, use the deployment URL. For now, we connect to DB directly or use an internal call.
    // However, since this is a server component, we can just use the DB directly to get the current day count.

    // Actually, calling the DB directly is better for Server Components.
    const { getCurrentDaycount } = await import('../../lib/server-utils');
    const currentDaycount = await getCurrentDaycount();

    let todayCount = 0;
    let errorMsg = '';

    try {
        if (currentDaycount !== -1) {
            const db = await getHamonDB();
            // Count how many entries have daycnt matching currentDaycount
            todayCount = db.filter(entry => Number(entry.daycnt) === currentDaycount).length;
        }
    } catch {
        errorMsg = '데이터를 불러오는 중 오류가 발생했습니다.';
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">오늘 진행한 함온성 힛수</h3>
                    {currentDaycount === -1 ? (
                        <p className="text-gray-500">오늘의 일정(Plan)이 없습니다.</p>
                    ) : (
                        <div className="flex items-end">
                            <span className="text-4xl font-bold text-blue-600">{todayCount}</span>
                            <span className="text-gray-500 ml-2 mb-1">명 완료 ({currentDaycount}일차)</span>
                        </div>
                    )}
                    {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
                </div>
            </div>
        </div>
    );
}
