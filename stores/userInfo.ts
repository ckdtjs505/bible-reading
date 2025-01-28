import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type userInfoParam = {
  userName: string;
  setUserName: (data: string) => void;
  completedDayCountList: number[];
  setComplteDayCountList: (daycounts: number[]) => void;
  addCompleteDayCountList: (daycount: number) => void;
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
        // 이름 변경 후 진입시 이전에 저장했던 정보가 남아 있음
        set(() => ({
          completedDayCountList: [...daycounts],
        }));
      },
      addCompleteDayCountList: (daycount: number) => {
        set((state) => ({
          completedDayCountList: [...state.completedDayCountList, daycount],
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
      partialize: (state) => ({ userName: state.userName }),
    },
  ),
);

export default useUserInfo;
