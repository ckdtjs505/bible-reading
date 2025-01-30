"use client";

import { usePlans } from "@/stores/plan";

export const YoutubeVideo = () => {
  const { currentPlan } = usePlans();
  return (
    currentPlan?.videoId && (
      <iframe
        width={"100%"}
        height="315"
        className="p-4 "
        src={`https://www.youtube.com/embed/${currentPlan.videoId}`}
        title="함온성"
      ></iframe>
    )
  );
};
