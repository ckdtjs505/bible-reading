import { plan } from "@/constants/plan";
import { Plan } from "@/type/biblePlan";
import { create } from "zustand";

interface PlansState {
  currentPlan: Plan; // 말씀권이 2개 있는 경우가 있어서
  setCurrentPlan: (date: Date) => void;
}

const findPlan = (date: Date) => {
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const currentPlan = plan
    .filter((_plan) => _plan.date === formattedDate)
    .reduce<Plan>(
      (acc, val) => {
        return {
          index: val.index,
          daycount: val.daycount,
          date: val.date,
          lang: val.lang,
          verseRange: [
            ...acc.verseRange,
            {
              book: val.book,
              start: Number(val.start),
              end: Number(val.end),
            },
          ],
          img: val.img,
          videoId: val.videoId,
        };
      },
      {
        index: "-1",
        daycount: "",
        date: "",
        lang: "",
        verseRange: [],
        img: "",
        videoId: "",
      },
    );
  return currentPlan;
};

export const usePlans = create<PlansState>((set) => ({
  currentPlan: findPlan(new Date()),
  setCurrentPlan: (date) =>
    set(() => {
      return {
        currentPlan: findPlan(date),
      };
    }),
}));
