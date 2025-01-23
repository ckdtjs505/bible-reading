import { bookKeyNumber } from "@/constants/bibleNumber";
import { Verse } from "@/type/biblePlan";
import { NextApiRequest, NextApiResponse } from "next";

const GOOGLE_DOMAIN = "https://script.google.com";
const GOOGLE_KEY = `AKfycbx59b6woS9-hkh8jkk93zrBUOSwbiI6JvBQT0-wdP-zxD_dNFrnL_t5WNvuulvzNtOq`;

type DailyVeserParams = {
  book: string;
  start: number;
  end: number;
};

type Response = Verse[];

export const getDailyVerse = async ({
  book,
  start,
  end,
}: DailyVeserParams): Promise<Response> => {
  try {
    const queryParam = new URLSearchParams({
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
    return data;
  } catch (e) {
    throw e;
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const dailyVerse = await getDailyVerse({
      book: "창세기",
      start: 1,
      end: 2,
    });

    console.log(dailyVerse);
    res.status(200).json(dailyVerse); // 외부 API로부터 받은 데이터를 클라이언트로 전달
  } catch (error) {
    res.status(500).json({ message: "Error fetching Bible plans" });
  }
};
