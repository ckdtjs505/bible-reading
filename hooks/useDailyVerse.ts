import { getDailyVerse } from "@/app/actions/bible";
import { Plan, Verse } from "@/type/biblePlan";
import { useQuery } from "@tanstack/react-query";

interface DailyVerseData {
    book: string;
    verses: Verse[];
}

export const useDailyVerse = (
    currentPlan: Plan | null,
    bibleVersion: "revised" | "woorimal" | "newHangul" = "revised"
) => {
    return useQuery({
        queryKey: ["dailyVerse", currentPlan?.date, bibleVersion],
        queryFn: async (): Promise<DailyVerseData[]> => {
            if (!currentPlan) return [];

            const promises = currentPlan.verseRange.map(async ({ book, start, end }) => {
                const verses = await getDailyVerse({
                    book,
                    start,
                    end,
                    bible: bibleVersion,
                });
                return {
                    book,
                    verses,
                };
            });

            return Promise.all(promises);
        },
        enabled: !!currentPlan, // Only fetch if there is a plan
        staleTime: Infinity, // Bible verses don't change
    });
};
