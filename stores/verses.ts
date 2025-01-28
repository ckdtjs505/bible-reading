import { Verse } from "@/type/biblePlan";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Bible = "revised" | "woorimal";

interface VersesState {
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
      bible: "revised",
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
    },
  ),
);
export default useVerses;
