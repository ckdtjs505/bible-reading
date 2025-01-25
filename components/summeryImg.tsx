"use client";

import { usePlan } from "@/stores/plan";

const SummeryImg = () => {
  const { selectDayPlan } = usePlan();

  return (
    selectDayPlan.img && (
      <img src={selectDayPlan.img} alt="img" className="p-4 w-full"></img>
    )
  );
};

export default SummeryImg;
