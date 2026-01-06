
import { getHamonDB, ReadingStatus } from '../../lib/server-utils';


// 성경 책 이름 목록
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

// 간단한 불용어 목록
const STOP_WORDS = new Set([
    "오늘", "오늘도", "나의", "내가", "우리", "주신", "통해", "하게", "하지", "것을", "있는", "하는", "합니다",
    "그리고", "그러나", "하지만", "그래서", "또한", "나는", "저는", "제가", "저의", "주님", "하나님",
    "말씀", "말씀을", "말씀이", "묵상", "함께", "주셔서", "감사합니다", "아멘", "위해", "대한", "사람", "생각"
]);

import AdminDashboardClient from "./dashboard-client";

export default async function AdminDashboard() {
    // 절대 경로를 사용하여 API에서 오늘의 계획 가져오기 (서버 사이드)
    // 프로덕션 환경에서는 배포 URL을 사용. 현재는 DB에 직접 연결하거나 내부 호출 사용.
    // 하지만, 서버 컴포넌트이므로 직접 DB를 사용하여 현재 일차를 가져올 수 있음.

    // 실제로, 서버 컴포넌트에서는 DB를 직접 호출하는 것이 더 좋음.
    const { getCurrentDaycount } = await import('../../lib/server-utils');
    const currentDaycount = await getCurrentDaycount();

    let todayCount = 0;
    let errorMsg = '';

    // UI용 데이터 구조
    let dailyStats: { day: number; count: number; names: string[]; topVerses: { ref: string; count: number }[] }[] = [];
    let memberStats: { name: string; count: number; lastActive: string }[] = [];
    let verseStats: { ref: string; count: number }[] = [];
    let keywordStats: { word: string; count: number }[] = [];
    let allLogs: ReadingStatus = [];
    let totalSubmissions = 0;
    let uniqueMembersCount = 0;

    try {
        const db = await getHamonDB();

        // 1. 오늘의 카운트
        if (currentDaycount !== -1) {
            todayCount = db.filter(entry => Number(entry.daycnt) === currentDaycount).length;
        }

        // 2. 일별 통계 & 멤버 통계 처리
        const dailyMap = new Map<number, Set<string>>();
        const dailyVerseMap = new Map<number, Map<string, number>>(); // 일차 -> 구절 -> 횟수
        const memberMap = new Map<string, { count: number; lastActive: string }>();
        const verseCountMap = new Map<string, number>();
        const keywordCountMap = new Map<string, number>();

        // 로그 정렬 복사본 생성 (최신순)
        const sortedDb = [...db].reverse();
        allLogs = sortedDb;

        db.forEach(entry => {
            const day = Number(entry.daycnt);

            // 일별 통계
            if (!isNaN(day)) {
                if (!dailyMap.has(day)) {
                    dailyMap.set(day, new Set());
                }
                dailyMap.get(day)?.add(entry.name);
            }

            // 멤버 통계
            if (entry.name) {
                const currentData = memberMap.get(entry.name) || { count: 0, lastActive: '' };
                memberMap.set(entry.name, { count: currentData.count + 1, lastActive: entry.Timestamp });
            }

            // 성경 구절 & 키워드 분석 (나의 묵상 내용 기반)
            if (entry.myMessage) {
                const message = entry.myMessage;

                // 1. 구절 참조 추출 (책 + 장:절)
                // 책 식별
                const book = BIBLE_BOOKS.find(b => message.includes(b));
                // 장:절 패턴 식별 (예: 1:1, 1:1-5, 1장 1절)
                // 표준 형식을 잡기 위한 완화된 정규식
                const verseMatch = message.match(/(\d+)\s*[:장]\s*(\d+)(?:[-~]\s*(\d+))?/);

                if (book && verseMatch) {
                    const chapter = verseMatch[1];
                    const v1 = verseMatch[2];
                    const v2 = verseMatch[3]; // 선택적 종료 절
                    const ref = `${book} ${chapter}:${v1}${v2 ? '-' + v2 : ''}`;

                    // 전체 통계
                    verseCountMap.set(ref, (verseCountMap.get(ref) || 0) + 1);

                    // 일별 통계
                    if (!isNaN(day)) {
                        if (!dailyVerseMap.has(day)) {
                            dailyVerseMap.set(day, new Map());
                        }
                        const dayVerses = dailyVerseMap.get(day)!;
                        dayVerses.set(ref, (dayVerses.get(ref) || 0) + 1);
                    }
                }

                // 2. 키워드 추출
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

        // 통계 확정
        dailyStats = Array.from(dailyMap.entries())
            .map(([day, namesSet]) => {
                // 해당 일차의 상위 구절 처리
                const verseMap = dailyVerseMap.get(day);
                let topVerses: { ref: string; count: number }[] = [];
                if (verseMap) {
                    topVerses = Array.from(verseMap.entries())
                        .map(([ref, count]) => ({ ref, count }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 3); // 일별 상위 3개 구절
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
            .slice(0, 10); // 상위 10개 구절

        keywordStats = Array.from(keywordCountMap.entries())
            .map(([word, count]) => ({ word, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10); // 상위 10개 키워드

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
