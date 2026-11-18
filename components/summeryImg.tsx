"use client";

import { usePlans } from "@/stores/plan";

const SummeryImg = () => {
  const { currentPlan } = usePlans();

  return (
    currentPlan?.img ? (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={currentPlan.img} alt="오늘 읽을 분량 요약 그림" className="p-4 w-full"></img>
      </>
    ) : null
  );
};

export default SummeryImg;
