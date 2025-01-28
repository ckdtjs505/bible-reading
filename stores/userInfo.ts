import { getUserProgressInfo } from "@/pages/api/userInfo";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type userInfoParam = {
  userName: string;
  completedDayCountList: number[];
  updateUserInfo: (data: { userName: string }) => void;
  _hasHydrated: boolean;
  setHasHydrated: (data: boolean) => void;
};

const useUserInfo = create<userInfoParam>()(
  persist(
    (set) => ({
      userName: "",
      completedDayCountList: [],
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },
      updateUserInfo: async ({ userName }) => {
        const data = await getUserProgressInfo(userName);
        set(() => ({
          userName: userName,
          completedDayCountList: data.row,
        }));
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
