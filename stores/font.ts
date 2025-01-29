import { create } from "zustand";
import { persist } from "zustand/middleware";

type FontLevel = {
  level: number;
  fontLevel: string;
  setFontLevel: (level: number) => void;
};

const fontLevels = [
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
];

export const useFontLevel = create<FontLevel>()(
  persist(
    (set) => ({
      level: 3,
      fontLevel: fontLevels[3],
      setFontLevel: (level: number) => {
        set(() => {
          const newLevel = Math.max(0, Math.min(level, fontLevels.length - 1)); // level 범위 제한

          return {
            level: newLevel,
            fontLevel: fontLevels[newLevel],
          };
        });
      },
    }),
    {
      name: "fontLevel",
    },
  ),
);
