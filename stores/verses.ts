import { create } from "zustand";
import { persist } from "zustand/middleware";

type Bible = "revised" | "woorimal";

interface VersesState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  bible: Bible;
  setBible: (data: Bible) => void;
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
      setBible: (bible: Bible) => {
        set(() => ({
          bible: bible,
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
