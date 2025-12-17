
import { Plan, ScheduleItem } from "@/type/biblePlan";
import { create } from "zustand";

interface PlansState {
  currentPlan: Plan | null;
  setCurrentPlan: (plan: Plan | null) => void;
}



export const usePlans = create<PlansState>((set) => ({
  currentPlan: null,
  setCurrentPlan: (plan: Plan | null) => set({ currentPlan: plan }),
}));
