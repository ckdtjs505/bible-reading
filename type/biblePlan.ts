import { bookCode } from "@/constants/bibleCode";

type Book = keyof typeof bookCode; // 키 타입
export type BookCode = (typeof bookCode)[Book]; // 값 타입

export type Plan = {
  index: string;
  daycount: string;
  date: string;
  lang: string;
  img: string;
  videoId: string;
  verseRange : VerseRange[];
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
