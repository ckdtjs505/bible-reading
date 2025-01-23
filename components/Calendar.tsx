"use client";

import "./Calendar.css";
import { Calendar as RCalendar } from "react-calendar";
import React, { useEffect, useState } from "react";
import { Plan, Verse } from "@/type/biblePlan";
import { getBiblePlan } from "@/pages/api/biblePlan";
import { getDailyVerse } from "@/pages/api/bible";
import { useFontLevel } from "@/stores/font";

const Calendar: React.FC = () => {
  const [planInfo, setPlanInfo] = useState<Plan[]>([]);
  const [verse, setVerse] = useState<{ book?: string; data?: Verse[] }>({});
  const [img, setImg] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");
  const { fontLevel, setFontLevel } = useFontLevel();

  useEffect(() => {
    const value = getBiblePlan();
    setPlanInfo(value);
  }, []);

  useEffect(() => {
    if (planInfo) {
      handleClickDay(new Date());
    }
  }, [planInfo]);

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

    console.log(planInfo[planInd]);
    if (planInd >= 0) {
      const data = getDailyVerse({
        book: planInfo[planInd].book,
        start: Number(planInfo[planInd].start),
        end: Number(planInfo[planInd].end),
      });

      setVideoId(planInfo[planInd].videoId);
      setImg(planInfo[planInd].img);
      setVerse({ book: planInfo[planInd].book, data });
    } else {
      setVideoId('');
      setImg('');
      setVerse({ book: '', data : [] });

    }
  };

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

      {videoId && (
        <iframe
          width={"100%"}
          height="315"
          className="p-2 "
          src={`https://www.youtube.com/embed/${videoId}`}
          title="함온성"
        ></iframe>
      )}
      {img && <img src={img} alt="img" className="p-2 w-full"></img>}

      <div className="m-2 text-2xl">
        <div>{verse.book}</div>
        {verse.data?.map(({ chapter, verse, message }, index) => {
          return (
            <div key={index}>
              <div className={`${fontLevel}`}>
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
