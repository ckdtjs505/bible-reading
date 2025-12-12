"use server";

import { bible as koreanBible } from "@/constants/bible";
import { bookKeyNumber } from "@/constants/bibleNumber";
import { newBible } from "@/constants/newBible";
import { newHangleBible } from "@/constants/newHangulBible";
import { Verse } from "@/type/biblePlan";

export type DailyVeserParams = {
    book: string;
    start: number;
    end: number;
    bible: string;
};

type Response = Verse[];

export const getDailyVerse = async ({
    bible,
    book,
    start,
    end,
}: DailyVeserParams): Promise<Response> => {
    try {
        const bookNumber = bookKeyNumber(book);

        const result: Verse[] = [];

        if (bible === "woorimal") {
            koreanBible.forEach(({ book, chapter, content, verse }) => {
                // book - 어떤 성경인지
                if (
                    bookNumber == Number(book) &&
                    start <= Number(chapter) &&
                    end >= Number(chapter)
                ) {
                    result.push({
                        chapter: Number(chapter),
                        verse: Number(verse),
                        message: content,
                    });
                }
            });
        } else if (bible == "newHangul") {
            newHangleBible.forEach(({ book, chapter, content, verse }) => {
                // book - 어떤 성경인지
                if (
                    bookNumber == Number(book) &&
                    start <= Number(chapter) &&
                    end >= Number(chapter)
                ) {
                    result.push({
                        chapter: Number(chapter),
                        verse: Number(verse),
                        message: content,
                    });
                }
            });
        } else {
            newBible.forEach(({ book, chapter, content, verse }) => {
                // book - 어떤 성경인지
                if (
                    bookNumber == Number(book) &&
                    start <= Number(chapter) &&
                    end >= Number(chapter)
                ) {
                    result.push({
                        chapter: Number(chapter),
                        verse: Number(verse),
                        message: content,
                    });
                }
            });
        }

        return result;
    } catch (e) {
        throw e;
    }
};
