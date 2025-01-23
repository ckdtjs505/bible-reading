"use client";

import "./Calendar.css";
import { Calendar as RCalendar } from "react-calendar";
import React, { useEffect, useState } from "react";
import { BiblePlan, Verse } from "@/type/biblePlan";
import { getBiblePlan } from "@/pages/api/biblePlan";
import { getDailyVerse } from "@/pages/api/bible";

const Calendar: React.FC = () => {
  const [planInfo, setPlanInfo] = useState<BiblePlan>([]);
  const [verse, setVerse] = useState<Verse[]>([]);

  useEffect(() => {
    getBiblePlan().then((value) => {
      setPlanInfo(value);
    });
  }, []);

  const tileContent = ({ date }: { date: Date }) => {
    const currentDate = new Date(date);
    const currentDateYYYYMMDD = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
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
    const currentDate = new Date(date);
    const currentDateYYYYMMDD = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    const planInd = planInfo?.findIndex(
      (plan) => plan.date === currentDateYYYYMMDD,
    );

    if (planInd >= 0) {
      getDailyVerse({
        book: planInfo[planInd].book,
        start: planInfo[planInd].start,
        end: planInfo[planInd].end,
      }).then((data) => {
        setVerse(data);
      });
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
      <div>
        {verse.map(({ verse, message }, index) => {
          return (
            <div key={index}>
              {verse} {message}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
