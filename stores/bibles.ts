import { create } from "zustand";

const useBible = create((set) => {
  return {
    bible: "KoreanBible",
    setBible: (value) => {
      set(() => ({
        bible: value,
      }));
    },
  };
});

export default useBible;
