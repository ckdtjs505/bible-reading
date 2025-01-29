import { Verse } from "@/type/biblePlan";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Bible = "revised" | "woorimal";

interface VersesState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  bible: Bible;
  verses: Verse[];
  book: string;
  setBible: (data: Bible) => void;
  setVerses: (data: Verse[]) => void;
  setBook: (data: string) => void;
}

const useVerses = create<VersesState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },
      bible: "woorimal",
      verses: [],
      book: "",
      setBible: (bible: Bible) => {
        set(() => ({
          bible: bible,
        }));
      },
      setVerses: (verses: Verse[]) => {
        set(() => ({
          verses: verses,
        }));
      },
      setBook: (data: string) => {
        set(() => ({
          book: data,
        }));
      },
    }),
    {
      name: "verses",
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
      partialize: (state) => ({
        bible: state.bible,
      }),
    },
  ),
);
export default useVerses;
