"use client";

import "./Calendar.css";
import { Calendar as RCalendar } from "react-calendar";
import React, { useEffect, useState } from "react";
import { Plan, Verse } from "@/type/biblePlan";
import { getBiblePlan } from "@/pages/api/biblePlan";
import { getDailyVerse } from "@/pages/api/bible";

const Calendar: React.FC = () => {
  const [planInfo, setPlanInfo] = useState<Plan[]>([]);
  const [verse, setVerse] = useState<{ book?: string; data?: Verse[] }>({});

  useEffect(() => {
   const value =  getBiblePlan()
      setPlanInfo(value);
  }, []);

  const foramtDate = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  const tileContent = ({ date }: { date: Date }) => {
    const currentDateYYYYMMDD = foramtDate(new Date(date));
    const planInd = planInfo?.findIndex(
      (plan) => plan.date === currentDateYYYYMMDD,
    );

    if (planInd >= 0) {
      return (
        <div>
          {planInfo[planInd].book}
          <br />
          {planInfo[planInd].start}-{planInfo[planInd].end}장
        </div>
      );
    }
  };

  const handleClickDay = (date: Date) => {
    const currentDateYYYYMMDD = foramtDate(new Date(date));
    const planInd = planInfo?.findIndex(
      (plan) => plan.date === currentDateYYYYMMDD,
    );

    console.log(planInfo[planInd])
    if (planInd >= 0) {
      const data = getDailyVerse({
        book: planInfo[planInd].book,
        start: planInfo[planInd].start,
        end: planInfo[planInd].end,
      });

      setVerse({ book: planInfo[planInd].book, data });
    }
  };

  return (
    <div>
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
      <div className="m-2 text-2xl">
        <div>{verse.book}</div>
        {verse.data?.map(({ chapter, verse, message }, index) => {
          return (
            <div key={index}>
              <div className="text-xl font-light">
                {chapter}:{verse} {message}
              </div>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
