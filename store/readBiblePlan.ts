import { create } from "zustand";
import { getBiblePlan } from "@/app/api/api";
const initialState = {
  loading: false,
  success: false,
  error: false,
  data: null,
  errorData: null,
};

export const useReadBiblePlanData = create((set) => ({
  ...initialState,

  execute: async () => {
    set({ ...initialState, loading: true });

    try {
      const res = await getBiblePlan();
      set({ ...initialState, succcess: true, data: res.data });
    } catch (err) {
      console.error("Error in data fetch", err);
      set({ ...initialState, error: true, errorData: err });
    }
  },
}));
