import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type userInfoParam = {
  userName: string;
  setUserName: (data: string) => void;
  completedIndexList: string[];
  setCompletedIndexList: (indices: string[]) => void;
  addCompletedIndexList: (index: string) => void;
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
      completedIndexList: [],
      setCompletedIndexList: (indices: string[]) => {
        // 이름 변경 후 진입시 이전에 저장했던 정보가 남아 있음
        set(() => ({
          completedIndexList: [...indices],
        }));
      },
      addCompletedIndexList: (index: string) => {
        set((state) => ({
          completedIndexList: [...state.completedIndexList, index],
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
      version: 1,
    },
  ),
);

export default useUserInfo;
