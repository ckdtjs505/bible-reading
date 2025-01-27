import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type userInfoParam = {
  userName: string;
  updateUserInfo: (data: { userName: string }) => void;
};

const useUserInfo = create<userInfoParam>()(
  persist(
    (set) => ({
      userName: "",
      updateUserInfo: ({ userName }) => {
        set(() => ({
          userName: userName,
        }));
      },
    }),
    {
      name: "userName",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUserInfo;
