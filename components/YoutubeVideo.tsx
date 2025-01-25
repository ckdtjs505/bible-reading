"use client";

import { usePlan } from "@/stores/plan";

export const YoutubeVideo = () => {
  const { selectDayPlan } = usePlan();
  return (
    selectDayPlan?.videoId && (
      <iframe
        width={"100%"}
        height="315"
        className="p-4 "
        src={`https://www.youtube.com/embed/${selectDayPlan.videoId}`}
        title="함온성"
      ></iframe>
    )
  );
};
