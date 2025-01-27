import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type userInfoParam = {
  userName: string;
  updateUserInfo: (data: { userName: string }) => void;
  _hasHydrated: boolean;
  setHasHydrated: (data: boolean) => void;
};

const useUserInfo = create<userInfoParam>()(
  persist(
    (set) => ({
      userName: "",
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },
      updateUserInfo: ({ userName }) => {
        set(() => ({
          userName: userName,
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
