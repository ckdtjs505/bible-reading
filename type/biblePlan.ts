import { bookCode } from "@/constants/bibleCode";

type Book = keyof typeof bookCode; // 키 타입
export type BookCode = (typeof bookCode)[Book]; // 값 타입

// Raw data from DB/API
export type ScheduleItem = {
  _id?: string; // MongoDB ID
  year?: string;
  index: string;
  daycount: string;
  date: string;
  lang: string;
  book: string;
  start: string;
  end: string;
  img: string;
  videoId: string;
};

// Application Level Plan (Grouped by date)
export type Plan = {
  index: string;
  daycount: string;
  date: string;
  lang: string;
  img: string;
  videoId: string;
  verseRange: VerseRange[];
};

type VerseRange = {
  book: string;
  start: number;
  end: number;
};

export type Verse = {
  chapter: number;
  verse: number;
  message?: string;
};

export type Bible = "revised" | "woorimal";
