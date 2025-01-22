import { BiblePlan, bookKeyNumber } from "@/type/biblePlan";

const GOOGLE_DOMAIN = "https://script.google.com";
const GOOGLE_KEY = `AKfycbx59b6woS9-hkh8jkk93zrBUOSwbiI6JvBQT0-wdP-zxD_dNFrnL_t5WNvuulvzNtOq`;

export const getBiblePlan = (): Promise<BiblePlan> => {
  const queryParam = new URLSearchParams({
    type: "admin",
    userName: "오창선",
  });

  return fetch(`${GOOGLE_DOMAIN}/macros/s/${GOOGLE_KEY}/exec?${queryParam}`, {
    headers: {
      "content-Type": "text/plain;charset=utf-8",
    },
  })
    .then((response) => {
      const res = response.json();
      return res;
    })
    .catch((e) => {
      console.log(e);
    });
};

type DailyVeserParams = {
  book: string;
  start: number;
  end: number;
};
export const getDailyVerse = ({
  book,
  start,
  end,
}: DailyVeserParams): Promise<T> => {
  const queryParam = new URLSearchParams({
    type: "getBible",
    book: bookKeyNumber(book),
    start: start,
    end: end,
  });

  return fetch(`${GOOGLE_DOMAIN}/macros/s/${GOOGLE_KEY}/exec?${queryParam}`, {
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  })
    .then((response) => {
      const res = response.json();
      return res;
    })
    .then((res) => {
      //    return res.map(
      //    (data) => new DailyVerseModel(data.chapter, data.message, data.verse),
      //);
      //
      return res;
    })
    .catch((e) => {
      console.error(e);
    });
};
