import { plan } from "@/constants/plan";
import { Plan } from "@/type/biblePlan";
import { create } from "zustand";

interface PlansState {
  plans: Plan[];
  currentPlan: Plan;
  setCurrentPlan: (date: Date) => void;
}

const defaultPlan: Plan = {
  index: "-1",
  start: "",
  end: "",
  daycount: "",
  img: "",
  videoId: "",
  date: "",
  book: "",
  lang: "",
};

const findPlan = (date: Date) => {
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const currentPlanIdx = plan.findIndex(
    (dayPlan) => dayPlan.date === formattedDate,
  );

  return currentPlanIdx !== -1 ? plan[currentPlanIdx] : defaultPlan;
};

export const usePlans = create<PlansState>((set) => ({
  plans: plan,
  currentPlan: findPlan(new Date()),
  setCurrentPlan: (date) =>
    set(() => {
      return {
        currentPlan: findPlan(date),
      };
    }),
}));
