
import { Plan, ScheduleItem } from "@/type/biblePlan";
import { create } from "zustand";

interface PlansState {
  schedules: ScheduleItem[]; // Flattened list from DB
  currentPlan: Plan | null;
  isLoading: boolean;
  year: string;
  fetchSchedules: (year: string) => Promise<void>;
  setCurrentPlan: (date: Date) => void;
}

const transformToPlan = (date: Date, schedules: ScheduleItem[]): Plan | null => {
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const dailyItems = schedules.filter((item) => item.date === formattedDate);

  if (dailyItems.length === 0) return null;

  return dailyItems.reduce<Plan>(
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
    }
  );
};

export const usePlans = create<PlansState>((set, get) => ({
  schedules: [],
  currentPlan: null,
  isLoading: false,
  year: '2026', // Default year

  fetchSchedules: async (year: string) => {
    // Prevent refetch if already have data for this year? 
    // For now, let's fetch always or simple check
    if (get().year === year && get().schedules.length > 0) return;

    set({ isLoading: true });
    try {
      const res = await fetch(`/api/schedule?year=${year}`);
      if (!res.ok) throw new Error("Failed to fetch schedule");
      const data: ScheduleItem[] = await res.json();
      set({ schedules: data, year, isLoading: false });

      // Update current plan if date matches found data?
      // Actually setCurrentPlan calls transformToPlan which uses get().schedules
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  setCurrentPlan: (date: Date) =>
    set((state) => {
      return {
        currentPlan: transformToPlan(date, state.schedules),
      };
    }),
}));
