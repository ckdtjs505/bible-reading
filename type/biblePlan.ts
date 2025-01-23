import { bookCode } from "@/constants/bibleCode";

type Book = keyof typeof bookCode; // 키 타입
export type BookCode = (typeof bookCode)[Book]; // 값 타입

type Plan = {
  book: Book;
  date: string;
  dayCount: number;
  end: number;
  start: number;
  img?: string;
  lang?: string;
  videoId?: string;
};

export type Verse = {
  chapter: number;
  verse: number;
  message?: string;
};

export type BiblePlan = Plan[];
