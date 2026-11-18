"use client";

import { usePlans } from "@/stores/plan";
import useUserInfo from "@/stores/userInfo";
import { useEffect, useState } from "react";

// 화면 아래 가운데에 작은 토스트처럼 떠서 기록 영역(기도일기)으로 데려다준다.
// 본문을 덜 가리도록 작게 두고, 기록 영역이 보이면 아래로 미끄러지며 숨는다.
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

  if (!currentPlan) return null;

  const isDone = completedIndexList.includes(currentPlan.index);
  const isShown = !isRecordVisible;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex justify-center px-4">
      <button
        type="button"
        aria-hidden={!isShown}
        tabIndex={isShown ? 0 : -1}
        onClick={() =>
          document
            .getElementById("userContent")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        className={`min-h-11 rounded-full px-5 text-base font-bold shadow-lg transition-[transform,opacity,background-color] duration-300 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 active:scale-95 ${
          isShown
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        } ${
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
