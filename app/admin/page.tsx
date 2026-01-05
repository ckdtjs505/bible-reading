
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

// Bible Books List (Korean)
const BIBLE_BOOKS = [
    "창세기", "출애굽기", "레위기", "민수기", "신명기", "여호수아", "사사기", "룻기",
    "사무엘상", "사무엘하", "열왕기상", "열왕기하", "역대상", "역대하", "에스라", "느헤미야", "에스더",
    "욥기", "시편", "잠언", "전도서", "아가", "이사야", "예레미야", "예레미야애가", "에스겔", "다니엘",
    "호세아", "요엘", "아모스", "오바댜", "요나", "미가", "나훔", "하박국", "스바냐", "학개", "스가랴", "말라기",
    "마태복음", "마가복음", "누가복음", "요한복음", "사도행전", "로마서", "고린도전서", "고린도후서",
    "갈라디아서", "에베소서", "빌립보서", "골로새서", "데살로니가전서", "데살로니가후서",
    "디모데전서", "디모데후서", "디도서", "빌레몬서", "히브리서", "야고보서",
    "베드로전서", "베드로후서", "요한1서", "요한2서", "요한3서", "유다서", "요한계시록"
];

// Simple stopwords list
const STOP_WORDS = new Set([
    "오늘", "오늘도", "나의", "내가", "우리", "주신", "통해", "하게", "하지", "것을", "있는", "하는", "합니다",
    "그리고", "그러나", "하지만", "그래서", "또한", "나는", "저는", "제가", "저의", "주님", "하나님",
    "말씀", "말씀을", "말씀이", "묵상", "함께", "주셔서", "감사합니다", "아멘", "위해", "대한", "사람", "생각"
]);

import AdminDashboardClient from "./dashboard-client";

export default async function AdminDashboard() {
    // Fetch today's plan from the API via absolute URL (server-side)
    // In production, use the deployment URL. For now, we connect to DB directly or use an internal call.
    // However, since this is a server component, we can just use the DB directly to get the current day count.

    // Actually, calling the DB directly is better for Server Components.
    const { getCurrentDaycount } = await import('../../lib/server-utils');
    const currentDaycount = await getCurrentDaycount();

    let todayCount = 0;
    let errorMsg = '';

    // Data structures for UI
    let dailyStats: { day: number; count: number; names: string[]; topVerses: { ref: string; count: number }[] }[] = [];
    let memberStats: { name: string; count: number; lastActive: string }[] = [];
    let verseStats: { ref: string; count: number }[] = [];
    let keywordStats: { word: string; count: number }[] = [];
    let allLogs: ReadingStatus = [];
    let totalSubmissions = 0;
    let uniqueMembersCount = 0;

    try {
        const db = await getHamonDB();

        // 1. Today's Count
        if (currentDaycount !== -1) {
            todayCount = db.filter(entry => Number(entry.daycnt) === currentDaycount).length;
        }

        // 2. Daily Stats & Member Stats Processing
        const dailyMap = new Map<number, Set<string>>();
        const dailyVerseMap = new Map<number, Map<string, number>>(); // Day -> Ref -> Count
        const memberMap = new Map<string, { count: number; lastActive: string }>();
        const verseCountMap = new Map<string, number>();
        const keywordCountMap = new Map<string, number>();

        // Create a sorted copy for logs (Newest first)
        const sortedDb = [...db].reverse();
        allLogs = sortedDb;

        db.forEach(entry => {
            const day = Number(entry.daycnt);

            // Daily Stats
            if (!isNaN(day)) {
                if (!dailyMap.has(day)) {
                    dailyMap.set(day, new Set());
                }
                dailyMap.get(day)?.add(entry.name);
            }

            // Member Stats
            if (entry.name) {
                const currentData = memberMap.get(entry.name) || { count: 0, lastActive: '' };
                memberMap.set(entry.name, { count: currentData.count + 1, lastActive: entry.Timestamp });
            }

            // Bible Verse & Keyword Analysis (on myMessage)
            if (entry.myMessage) {
                const message = entry.myMessage;

                // 1. Extract Verse Reference (Book + Chapter:Verse)
                // Identify Book
                const book = BIBLE_BOOKS.find(b => message.includes(b));
                // Identify Chapter:Verse pattern (e.g., 1:1, 1:1-5, 1장 1절)
                // Relaxed regex to catch standard formats
                const verseMatch = message.match(/(\d+)\s*[:장]\s*(\d+)(?:[-~]\s*(\d+))?/);

                if (book && verseMatch) {
                    const chapter = verseMatch[1];
                    const v1 = verseMatch[2];
                    const v2 = verseMatch[3]; // Optional end verse
                    const ref = `${book} ${chapter}:${v1}${v2 ? '-' + v2 : ''}`;

                    // Global Stats
                    verseCountMap.set(ref, (verseCountMap.get(ref) || 0) + 1);

                    // Daily Stats
                    if (!isNaN(day)) {
                        if (!dailyVerseMap.has(day)) {
                            dailyVerseMap.set(day, new Map());
                        }
                        const dayVerses = dailyVerseMap.get(day)!;
                        dayVerses.set(ref, (dayVerses.get(ref) || 0) + 1);
                    }
                }

                // 2. Keyword Extraction
                let tempMsg = message;
                BIBLE_BOOKS.forEach(b => {
                    tempMsg = tempMsg.replace(b, '');
                });

                const words = tempMsg.replace(/[^\w\s가-힣]/g, ' ').split(/\s+/);
                words.forEach(word => {
                    if (word.length >= 2 && !STOP_WORDS.has(word) && isNaN(Number(word))) {
                        keywordCountMap.set(word, (keywordCountMap.get(word) || 0) + 1);
                    }
                });
            }
        });

        // Finalize Stats
        dailyStats = Array.from(dailyMap.entries())
            .map(([day, namesSet]) => {
                // Process Top Verses for this Day
                const verseMap = dailyVerseMap.get(day);
                let topVerses: { ref: string; count: number }[] = [];
                if (verseMap) {
                    topVerses = Array.from(verseMap.entries())
                        .map(([ref, count]) => ({ ref, count }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 3); // Top 3 verses per day
                }

                return {
                    day,
                    count: namesSet.size,
                    names: Array.from(namesSet).sort(),
                    topVerses
                };
            })
            .sort((a, b) => b.day - a.day);

        memberStats = Array.from(memberMap.entries())
            .map(([name, data]) => ({
                name,
                count: data.count,
                lastActive: data.lastActive
            }))
            .sort((a, b) => b.count - a.count);

        verseStats = Array.from(verseCountMap.entries())
            .map(([ref, count]) => ({ ref, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Top 10 Verses

        keywordStats = Array.from(keywordCountMap.entries())
            .map(([word, count]) => ({ word, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // Top 10 Keywords

        totalSubmissions = db.length;
        uniqueMembersCount = memberStats.length;

    } catch {
        errorMsg = '데이터를 불러오는 중 오류가 발생했습니다.';
    }

    return (
        <AdminDashboardClient
            currentDaycount={currentDaycount}
            todayCount={todayCount}
            totalSubmissions={totalSubmissions}
            uniqueMembersCount={uniqueMembersCount}
            dailyStats={dailyStats}
            memberStats={memberStats}
            verseStats={verseStats}
            keywordStats={keywordStats}
            allLogs={allLogs}
            errorMsg={errorMsg}
        />
    );
}
