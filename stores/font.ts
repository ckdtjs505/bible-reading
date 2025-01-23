import { create } from 'zustand'

export const useFontLevel = create (set => {

    const fontLevels = [
        "text-xs","text-sm", "text-base", "text-lg",  "text-xl", "text-2xl", "text-3xl","text-4xl","text-5xl",
    ];

    return ({
        level: 2,
        fontLevel: fontLevels[2],
        setFontLevel: (level: number) => set({ level, fontLevel: fontLevels[level] })
    })
})