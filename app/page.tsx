"use client";

import Calendar from "@/components/Calendar";
import LoginDialog from "@/components/LoginDialog";
import MyWordsDialog from "@/components/MyWordsDialog";
import PrayerJournal from "@/components/PrayerJournal";
import ScrollButton from "@/components/ScrollUpButton";
import SummeryImg from "@/components/summeryImg";
import Verses from "@/components/Verses";
import { YoutubeVideo } from "@/components/YoutubeVideo";
import { useSchedules } from "@/hooks/useSchedules";

export default function Home() {
  const currentYear = new Date().getFullYear().toString();
  const { isLoading } = useSchedules(currentYear);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        {/* Bible Icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-24 h-24 text-blue-600 mb-6 animate-bounce"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="12" y1="6" x2="12" y2="14" />
          <line x1="9" y1="9" x2="15" y2="9" />
        </svg>
        <div className="text-xl font-bold text-gray-700">함온성 일정을 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <>
      <div id="title" className="text-center text-3xl mt-4 font-bold">
        함 온 성
      </div>
      <Calendar></Calendar>

      <YoutubeVideo />

      <SummeryImg />

      <Verses />

      <PrayerJournal />

      <LoginDialog />
      <MyWordsDialog />

      <ScrollButton />
    </>
  );
}
