"use client";

import "./Calendar.css";
import { Calendar as RCalendar } from "react-calendar";
import React, {
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { Plan, Verse } from "@/type/biblePlan";
import { getBiblePlan } from "@/pages/api/biblePlan";
import { getDailyVerse } from "@/pages/api/bible";
import { useFontLevel } from "@/stores/font";

const Calendar: React.FC = () => {
  const [planInfo, setPlanInfo] = useState<Plan[]>([]);
  const [verse, setVerse] = useState<{ book?: string; data?: Verse[] }>({});
  const [img, setImg] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");
  const { fontLevel } = useFontLevel();
  const [selectList, setSelectList] = useState<string[]>([]);
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
      setVideoId("");
      setImg("");
      setVerse({ book: "", data: [] });
    }
  };

  const handleClickMessage = (event: React.MouseEventHandler<HTMLElement>) => {
    const target = event?.target as HTMLElement;

    if (target.classList.contains("active")) {
      target.classList.remove("active");
      setSelectList(
        selectList.filter((value) => {
          return !(value === target.innerText);
        }),
      );
    } else {
      target.classList.add("active");
      setSelectList([...selectList, target.innerText]);
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
          className="p-4 "
          src={`https://www.youtube.com/embed/${videoId}`}
          title="함온성"
        ></iframe>
      )}

      {img && <img src={img} alt="img" className="p-4 w-full"></img>}

      <div className="p-4 text-2xl">
        <div>{verse.book}</div>
        {verse.data?.map(({ chapter, verse, message }, index) => {
          return (
            <div key={index}>
              <div className={`${fontLevel}`} onClick={handleClickMessage}>
                {chapter}:{verse} {message}
              </div>
              <br />
            </div>
          );
        })}
      </div>

      <div>
        <div id="userContent" className="p-4">
          <div id="submitdata">
            <div id="prayForUser">
              💝앞사람을 위한 기도 :
              <textarea
                id="prayForUserText"
                className="w-full h-20 border border-black"
              ></textarea>
            </div>
            <div>
              🌼 이름 : <span id="name">오창선</span>
            </div>
            📖 오늘 내게 주신 말씀 : <br />
            <div id="myMessage">
              {selectList.map((value, index) => {
                return (
                  <div key={index}>
                    {value} <br />
                  </div>
                );
              })}
            </div>
            <div id="prayBox">
              🙏 한줄 기도 :
              <textarea
                id="pray"
                className="w-full h-20 border border-black"
              ></textarea>
            </div>
            제 <span id="day"> 17 </span> 일차 완료했습니다. <br />
          </div>

          <button id="saveButton" type="button">
            복사하기
          </button>
          <button id="changeName" type="button">
            이름바꾸기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
