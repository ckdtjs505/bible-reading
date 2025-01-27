import { create } from "zustand";

type userInfoParam = {
  userName: string;
  updateUserInfo: (data: { userName: string }) => void;
};

const useUserInfo = create<userInfoParam>((set) => ({
  userName: localStorage.getItem("userName") || "",
  updateUserInfo: ({ userName }) => {
    localStorage.setItem("userName", userName);
    set(() => ({
      userName: userName,
    }));
  },
}));

export default useUserInfo;
