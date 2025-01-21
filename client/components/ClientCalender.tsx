"use client";
import { Calendar as RCalender } from "react-calendar";
import "../../app/calender.css";
import React from "react";

type Props = {
  planInfo: [];
};

const Calender: React.FC<Props> = ({ planInfo }) => {
  const tileContent = ({ date }) => {
    if (true) {
      return (
        <div>
          창세기
          <br />
          1장 ~ 4절
        </div>
      );
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
      next2AriaLabel="jump forward"
      prevLabel={"<"}
      nextLabel={">"}
      showNeighboringMonth={false}
      tileContent={tileContent}
    ></RCalender>
  );
};

export default Calender;
