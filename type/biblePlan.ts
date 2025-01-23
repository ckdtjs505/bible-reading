import { bookCode } from "@/constants/bibleCode";

type Book = keyof typeof bookCode; // 키 타입
export type BookCode = (typeof bookCode)[Book]; // 값 타입

export type Plan = { index: string; daycount: string; date: string; lang: string; book: string; start: string; end: string; img: string; videoId: string; }

export type Verse = {
  chapter: number;
  verse: number;
  message?: string;
};
