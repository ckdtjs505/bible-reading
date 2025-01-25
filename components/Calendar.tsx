"use client";

import "./Calendar.css";
import { Calendar as RCalendar } from "react-calendar";
import React, { useCallback, useEffect } from "react";
import { usePlan } from "@/stores/plan";
import useVerses from "@/stores/verses";

const Calendar: React.FC = () => {
  const { fetchVerses, initVerses } = useVerses();
  const { plan, updateDayPlan, fetchPlan } = usePlan();

  const handleClickDay = useCallback(
    (date: Date) => {
      const currentDateYYYYMMDD = foramtDate(new Date(date));
      const planInd = plan?.findIndex(
        (_plan) => _plan.date === currentDateYYYYMMDD,
      );

      if (planInd >= 0) {
        fetchVerses({
          book: plan[planInd].book,
          start: Number(plan[planInd].start),
          end: Number(plan[planInd].end),
        });
        updateDayPlan(date);
      } else {
        initVerses();
      }
    },
    [plan, fetchVerses, initVerses, updateDayPlan],
  );

  const foramtDate = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  const tileContent = ({ date }: { date: Date }) => {
    const currentDateYYYYMMDD = foramtDate(new Date(date));
    const planInd = plan?.findIndex(
      (_plan) => _plan.date === currentDateYYYYMMDD,
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

  useEffect(() => {
    if (!plan) {
      fetchPlan();
    }
    handleClickDay(new Date());
  }, [plan, fetchPlan, handleClickDay]);

  return (
    <div className="flex justify-center flex-col">
      <RCalendar
        formatDay={(_, date) => {
          return date
            .toLocaleString("ko-KR", { day: "2-digit" })
            .replace("일", "");
        }}
        calendarType="gregory"
        showWeekNumbers={false}
        next2Label={""}
        prev2Label={""}
        prevLabel={"<"}
        nextLabel={">"}
        showNeighboringMonth={false}
        tileContent={tileContent}
        onClickDay={handleClickDay}
      ></RCalendar>
    </div>
  );
};

export default Calendar;
