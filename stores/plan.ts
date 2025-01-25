import { plan } from "@/constants/plan";
import { Plan } from "@/type/biblePlan";
import { create } from "zustand";

interface PlanState {
  plan: Plan[];
  selectDayPlan: Plan;
  updateDayPlan: (date: Date) => void;
  fetchPlan: () => Promise<void>;
  setPlan: (data: Plan[]) => void;
}

export const usePlan = create<PlanState>((set) => ({
  plan: plan,
  fetchPlan: async () => {
    try {
      const date = new Date();
      set((state) => {
        const planInd = state.plan?.findIndex(
          (_plan) =>
            _plan.date ===
            `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        );

        return {
          plan: plan,
          selectDayPlan: plan[planInd],
        };
      });
    } catch (e) {
      console.log(e);
    }
  },
  selectDayPlan: plan[0],
  updateDayPlan: (date: Date) => {
    set((state) => {
      const planInd = state.plan?.findIndex(
        (_plan) =>
          _plan.date ===
          `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      );

      return {
        selectDayPlan: plan[planInd],
      };
    });
  },
  setPlan: (data) => set({ plan: data }),
}));
