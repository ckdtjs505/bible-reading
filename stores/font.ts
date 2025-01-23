import { create } from 'zustand'

type FontLevel = {
    level: number,
    fontLevel: string,
    setFontLevel: (level: number) => void
}

export const useFontLevel = create<FontLevel>(set => {

    const fontLevels = [
        "text-xs","text-sm", "text-base", "text-lg",  "text-xl", "text-2xl", "text-3xl","text-4xl","text-5xl",
    ];

    return ({
        level: 2,
        fontLevel: fontLevels[2],
        setFontLevel: (level: number) => set({ level, fontLevel: fontLevels[level] })
    })
})