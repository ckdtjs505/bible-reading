"use client";

import "./Calendar.css";
import { Calendar as RCalendar } from "react-calendar";
import React, { useEffect } from "react";
import { usePlan } from "@/stores/plan";
import useVerses from "@/stores/verses";
import { useTodayMessages } from "@/stores/todayMessage";
import useUserInfo from "@/stores/userInfo";
import { getDailyVerse } from "@/pages/api/bible";
import useStore from "@/stores/useStore";

const Calendar: React.FC = () => {
  const hasHydrated = useStore(useVerses, (state) => state._hasHydrated);
  const bible = useStore(useVerses, (state) => state.bible) || "";
  const { setVerses, setBook } = useVerses();
  const { plan, updateDayPlan, fetchPlan } = usePlan();
  const { clearMessages } = useTodayMessages();

  const { completedDayCountList } = useUserInfo();

  const handleClickDay = (date: Date) => {
    const planInd = plan?.findIndex(
      (_plan) =>
        _plan.date ===
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    );

    if (planInd >= 0) {
      const verse = getDailyVerse({
        book: plan[planInd].book,
        start: Number(plan[planInd].start),
        end: Number(plan[planInd].end),
        bible: bible,
      });

      setVerses(verse);
      setBook(plan[planInd].book);
    } else {
      setVerses([]);
    }
    clearMessages();
    updateDayPlan(date);
  };

  const tileContent = ({ date }: { date: Date }) => {
    const planInd = plan?.findIndex(
      (_plan) =>
        _plan.date ===
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    );

    if (planInd >= 0) {
      return (
        <div>
          {plan[planInd].book}
          <br />
          {plan[planInd].start}-{plan[planInd].end}장
        </div>
      );
    }
  };

  const handleTileClassName = ({ date }: { date: Date }) => {
    let className: string = "";

    const day = date.getDay() + 1;
    if (day === 1) {
      className = className + " sunday";
    }
    if (day === 7) {
      className = className + " saturday";
    }

    const planInd = plan?.findIndex(
      (_plan) =>
        _plan.date ===
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    );
    if (planInd >= 0) {
      if (completedDayCountList.includes(Number(plan[planInd].daycount)))
        className = className + " active";
    }

    return className;
  };

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }
    if (!plan) {
      fetchPlan();
    }
  }, [plan, fetchPlan, hasHydrated]);

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
