"use client";

import { usePlans } from "@/stores/plan";

const SummeryImg = () => {
  const { currentPlan } = usePlans();

  return (
    currentPlan?.img && (
      <img src={currentPlan.img} alt="img" className="p-4 w-full"></img>
    )
  );
};

export default SummeryImg;
