"use client";

import "./Calendar.css";
import { Calendar as RCalender } from "react-calendar";
import React, { useEffect, useState } from "react";
import { BiblePlan } from "@/type/biblePlan";
import { getBiblePlan } from "@/pages/api/biblePlan";
import { getDailyVerse } from "@/pages/api/bible";

const Calender: React.FC = () => {
  const [planInfo, setPlanInfo] = useState<BiblePlan>([]);
  const [verse, setVerse] = useState([]);

  useEffect(() => {
    getBiblePlan().then(({ data }) => {
      setPlanInfo(data as BiblePlan);
    });
  }, []);

  const tileContent = ({ date }) => {
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

  const handleClickDay = (date) => {
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
      <RCalender
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
      ></RCalender>
      <div>
        {verse.map(({ chapter, verse, message }, index) => {
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

export default Calender;
