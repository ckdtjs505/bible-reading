"use client";

import { usePlans } from "@/stores/plan";
import useUserInfo from "@/stores/userInfo";
import { useEffect, useState } from "react";

// 기록 영역(기도일기)이 화면 밖에 있을 때 하단에 고정되어 바로 데려다주는 바
const TodayRecordBar = () => {
  const { currentPlan } = usePlans();
  const { completedIndexList } = useUserInfo();
  const [isRecordVisible, setIsRecordVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("userContent");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIsRecordVisible(entry.isIntersecting),
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [currentPlan?.index]);

  if (!currentPlan || isRecordVisible) return null;

  const isDone = completedIndexList.includes(currentPlan.index);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-white/95 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] border-t border-gray-200">
      <button
        type="button"
        onClick={() =>
          document
            .getElementById("userContent")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        className={`block min-h-14 w-full rounded-md px-4 text-lg font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
          isDone
            ? "bg-[#cbf1f5] text-[#171717]"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isDone
          ? `✓ 제 ${currentPlan.daycount}일차 기록했어요`
          : `제 ${currentPlan.daycount}일차 기록하러 가기 ↓`}
      </button>
    </div>
  );
};

export default TodayRecordBar;
