"use client";

import { usePlans } from "@/stores/plan";
import useUserInfo from "@/stores/userInfo";

// 달력 바로 아래에서 기록 영역(기도일기)으로 데려다주는 버튼. 본문을 가리지 않도록 고정하지 않는다
const TodayRecordBar = () => {
  const { currentPlan } = usePlans();
  const { completedIndexList } = useUserInfo();

  if (!currentPlan) return null;

  const isDone = completedIndexList.includes(currentPlan.index);

  if (isDone) {
    return (
      <div className="flex justify-center px-4 pt-3">
        <span className="inline-flex items-center rounded-full bg-[#cbf1f5] px-3 py-1 text-sm font-semibold text-[#171717]">
          ✓ 제 {currentPlan.daycount}일차 기록했어요
        </span>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <button
        type="button"
        onClick={() =>
          document
            .getElementById("userContent")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        className="block min-h-14 w-full rounded-md border border-blue-600 bg-white px-4 text-lg font-bold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        제 {currentPlan.daycount}일차 기록하러 가기 ↓
      </button>
    </div>
  );
};

export default TodayRecordBar;
