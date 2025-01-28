"use client";

import "./Calendar.css";
import { Calendar as RCalendar } from "react-calendar";
import React, { useCallback, useEffect } from "react";
import { usePlan } from "@/stores/plan";
import useVerses from "@/stores/verses";
import { useTodayMessage } from "@/stores/todayMessage";
import useUserInfo from "@/stores/userInfo";
import { getDailyVerse } from "@/pages/api/bible";

const Calendar: React.FC = () => {
  const { bible, setVerses, setBook } = useVerses();
  const { plan, updateDayPlan, fetchPlan } = usePlan();
  const { initMessage } = useTodayMessage();

  const { completedDayCountList } = useUserInfo();

  const handleClickDay = useCallback(
    (date: Date) => {
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
      initMessage();
      updateDayPlan(date);
    },
    [plan, updateDayPlan],
  );

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
    const planInd = plan?.findIndex(
      (_plan) =>
        _plan.date ===
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    );
    if (planInd >= 0) {
      if (completedDayCountList.includes(Number(plan[planInd].daycount)))
        return "active";
    }
  };

  useEffect(() => {
    if (!plan) {
      fetchPlan();
    }
    handleClickDay(new Date());
  }, [plan, fetchPlan, handleClickDay]);

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
