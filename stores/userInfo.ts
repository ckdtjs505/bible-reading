import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type userInfoParam = {
  userName: string;
  setUserName: (data: string) => void;
  completedDayCountList: number[];
  setComplteDayCountList: (daycounts: number[]) => void;
  _hasHydrated: boolean;
  setHasHydrated: (data: boolean) => void;
};

const useUserInfo = create<userInfoParam>()(
  persist(
    (set) => ({
      userName: "",
      setUserName: (userName: string) => {
        set({ userName: userName });
      },
      completedDayCountList: [],
      setComplteDayCountList: (daycounts: number[]) => {
        set((state) => ({
          completedDayCountList: [...state.completedDayCountList, ...daycounts],
        }));
      },
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: "userName",
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUserInfo;
