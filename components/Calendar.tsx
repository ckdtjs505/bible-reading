"use client";


import "./Calendar.css";
import { Calendar as RCalendar } from "react-calendar";
import React, { useEffect } from "react";
import { usePlans } from "@/stores/plan";
import useVerses from "@/stores/verses";
import useUserInfo from "@/stores/userInfo";
import useStore from "@/stores/useStore";

const Calendar: React.FC = () => {
  const hasHydrated = useStore(useVerses, (state) => state._hasHydrated);
  const { schedules, fetchSchedules, setCurrentPlan } = usePlans();
  const { completedDayCountList } = useUserInfo();

  // Fetch schedules on mount (or when year changes - implemented simply for now)
  useEffect(() => {
    fetchSchedules('2025'); // Default to 2025 or current year logic
    // We could make this dynamic based on the calendar's active view date
    fetchSchedules('2026'); // Pre-fetch 2026 too? Or just handle one year for now.
    // Ideally, fetchSchedules should append data? 
    // Current implementation replaces it. 
    // Let's stick to 2025/2026 logic or just fetching the needed year.

    // For this specific app context (Bible Reading per year), 
    // usually the user is on a specific year plan. 
    // Let's assume 2025 for now as per previous context, 
    // or maybe fetch both? 
    // The store implementation replaces 'schedules'.
    // Let's stick to '2025' for now as that's the main usage or check `new Date().getFullYear()`.
    fetchSchedules(String(new Date().getFullYear()));
  }, []);

  const handleClickDay = (date: Date) => {
    setCurrentPlan(date);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return;

    // Logic to find plan implementation inside component to avoid hooks in callback
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const targetPlan = schedules.filter((p) => p.date === formattedDate);

    return targetPlan.map(({ book, start, end }, index) => {
      return (
        <div key={index}>
          {book}
          <br />
          {start}-{end}장
        </div>
      );
    });
  };

  const handleTileClassName = ({
    date,
    view,
  }: {
    date: Date;
    view: string;
  }) => {
    if (view !== "month") return;
    let className: string = "";

    const day = date.getDay() + 1;
    if (day === 1) {
      className = className + " sunday";
    }
    if (day === 7) {
      className = className + " saturday";
    }

    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const planItem = schedules.find((p) => p.date === formattedDate);

    if (planItem) {
      if (completedDayCountList.includes(Number(planItem.daycount)))
        className = className + " active";
    }

    return className;
  };

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }
    // Set initial plan for today after hydration/data fetch?
    // Maybe checking if currentPlan is null and schedules exist using another useEffect
    setCurrentPlan(new Date());
  }, [hasHydrated, schedules.length]);

  return (
    <div className="flex justify-center flex-col font-bold">
      <RCalendar
        formatDay={(_, date) => {
          return date
            .toLocaleString("ko-KR", { day: "2-digit" })
            .replace("일", "");
        }}
        locale="ko-KR"
        calendarType="gregory"
        showWeekNumbers={false}
        next2Label={""}
        prev2Label={""}
        prevLabel={"<"}
        nextLabel={">"}
        showNeighboringMonth={false}
        tileContent={tileContent}
        onClickDay={handleClickDay}
        tileClassName={handleTileClassName}
      ></RCalendar>
    </div>
  );
};

export default Calendar;
