import { getHamonDB, getCurrentDaycount } from "../../../lib/server-utils";
import AdminStatusClient from "./status-client";

// 최신성을 보장하기 위해 상태 페이지 캐싱 비활성화
export const dynamic = 'force-dynamic';

export default async function AdminStatusPage() {
    // 병렬 데이터 가져오기
    const [db, currentDaycount] = await Promise.all([
        getHamonDB(),
        getCurrentDaycount()
    ]);

    // 데이터 처리
    const userMap = new Map<string, Set<number>>();
    let maxDayLog = 0;

    db.forEach(entry => {
        if (!entry.name) return;

        const day = Number(entry.daycnt);
        if (isNaN(day)) return;

        if (day > maxDayLog) maxDayLog = day;

        if (!userMap.has(entry.name)) {
            userMap.set(entry.name, new Set());
        }
        userMap.get(entry.name)?.add(day);
    });

    // 유저 요청에 따라 최대 일차를 268일로 설정
    const maxDay = 268;

    // 배열로 변환
    const statusData = Array.from(userMap.entries()).map(([name, daysSet]) => {
        return {
            name,
            completedDays: Array.from(daysSet).sort((a, b) => a - b),
            totalCount: daysSet.size,
            lastActive: '' // 필요하다면 계산할 수 있지만, 지금은 간단하게 유지하거나 나중에 추가
        };
    });

    // 전체 참여 횟수 내림차순 정렬
    statusData.sort((a, b) => b.totalCount - a.totalCount);

    return (
        <AdminStatusClient statusData={statusData} maxDay={maxDay} />
    );
}
