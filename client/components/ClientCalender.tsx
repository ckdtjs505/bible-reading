"use client";
import { Calendar as RCalender } from "react-calendar";
import "../../app/calender.css";
import React, { useEffect, useState } from "react";
import { getBiblePlan, getDailyVerse } from "@/services/api/biblePlan";
import { BiblePlan } from "@/type/biblePlan";

const Calender: React.FC = () => {
  const [planInfo, setPlanInfo] = useState<BiblePlan>([]);

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
        console.log(data);
      });
    }
  };

  return (
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
  );
};

export default Calender;
