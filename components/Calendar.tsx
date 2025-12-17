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
  // Fetch schedules for the current view on mount
  useEffect(() => {
    fetchSchedules(String(new Date().getFullYear()));
  }, [fetchSchedules]);

  const handleActiveStartDateChange = ({ activeStartDate, view }: any) => {
    if (view === 'month' && activeStartDate) {
      fetchSchedules(String(activeStartDate.getFullYear()));
    }
  };

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
  }, [hasHydrated, schedules.length, setCurrentPlan]);

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
        onActiveStartDateChange={handleActiveStartDateChange}
      ></RCalendar>
    </div>
  );
};

export default Calendar;
