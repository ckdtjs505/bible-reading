import { getDailyVerse } from "@/pages/api/bible";
import { Verse } from "@/type/biblePlan";
import { create } from "zustand";

type VersesState = {
  bible: string;
  book: string;
  start: number;
  end: number;
  verses: Verse[];
  fetchVerses: (data: { book: string; start: number; end: number }) => void;
  initVerses: () => void;
  updateBible: (data: { bible: string }) => void;
};

const useVerses = create<VersesState>((set) => ({
  bible: "koreanBible",
  book: "",
  start: 0,
  end: 0,
  verses: [],
  fetchVerses: ({ book, start, end }) => {
    try {
      set((state) => {
        const response = getDailyVerse({
          book,
          start,
          end,
          bible: state.bible,
        });

        return { verses: response, book: book, start: start, end: end };
      });
    } catch (e) {
      console.log(e);
    }
  },

  updateBible: ({ bible }) => {
    try {
      set((state) => {
        const response = getDailyVerse({
          book: state.book,
          start: state.start,
          end: state.end,
          bible: bible,
        });

        return { verses: response, bible: bible };
      });
    } catch (e) {
      console.log(e);
    }
  },
  initVerses: () => {
    set({ verses: [], book: "" });
  },
}));

export default useVerses;
