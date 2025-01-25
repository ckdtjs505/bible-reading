import { DailyVeserParams, getDailyVerse } from "@/pages/api/bible";
import { Verse } from "@/type/biblePlan";
import { create } from "zustand";

type VersesState = {
  book: string;
  verses: Verse[];
  fetchVerses: (data: DailyVeserParams) => void;
  initVerses: () => void;
};

const useVerses = create<VersesState>((set) => ({
  book: "",
  verses: [],
  fetchVerses: ({ book, start, end }) => {
    try {
      const response = getDailyVerse({
        book,
        start,
        end,
      });

      set({ verses: response, book: book });
    } catch (e) {
      console.log(e);
    }
  },
  initVerses: () => {
    set({ verses: [], book: "" });
  },
}));

export default useVerses;
