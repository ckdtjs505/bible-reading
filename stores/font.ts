import { create } from "zustand";

type FontLevel = {
  level: number;
  fontLevel: string;
  setFontLevel: (level: number) => void;
};

export const useFontLevel = create<FontLevel>((set) => {
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

  return {
    level: 1, // 기본값 설정
    fontLevel: fontLevels[1],
    setFontLevel: (level: number) =>
      set(() => {
        const newLevel = Math.max(0, Math.min(level, fontLevels.length - 1)); // level 범위 제한
        return {
          level: newLevel,
          fontLevel: fontLevels[newLevel],
        };
      }),
  };
});

