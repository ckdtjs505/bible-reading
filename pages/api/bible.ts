import { bible as koreanBible } from "@/constants/bible";
import { bookKeyNumber } from "@/constants/bibleNumber";
import { newBible } from "@/constants/newBible";
import { Verse } from "@/type/biblePlan";
import { NextApiRequest, NextApiResponse } from "next";

//const GOOGLE_DOMAIN = "https://script.google.com";
//const GOOGLE_KEY = `AKfycbx59b6woS9-hkh8jkk93zrBUOSwbiI6JvBQT0-wdP-zxD_dNFrnL_t5WNvuulvzNtOq`;

export type DailyVeserParams = {
  book: string;
  start: number;
  end: number;
  bible: string;
};

type Response = Verse[];

export const getDailyVerse = ({
  bible,
  book,
  start,
  end,
}: DailyVeserParams): Response => {
  try {
    const bookNumber = bookKeyNumber(book);
    /*
 * const queryParam = new URLSearchParams({
      type: "getBible",
      book: String(bookKeyNumber(book)),
      start: String(start),
      end: String(end),
    });

    const response = await fetch(
      `${GOOGLE_DOMAIN}/macros/s/${GOOGLE_KEY}/exec?${queryParam}`,
      {
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      },
    );

    if (!response.ok) {
      throw new Error("HTTP ERROR");
    }

    const data = await response.json();
  
*/
    const result: Verse[] = [];

    if (bible === "koreanBible") {
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

export default (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const dailyVerse = getDailyVerse({
      book: "창세기",
      start: 1,
      end: 5,
    });
    res.status(200).json(dailyVerse); // 외부 API로부터 받은 데이터를 클라이언트로 전달
  } catch (error) {
    res.status(500).json({ message: "Error fetching Bible plans" + error });
  }
};
