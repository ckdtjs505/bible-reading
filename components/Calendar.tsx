"use client";

import "./Calendar.css";
import { Calendar as RCalendar } from "react-calendar";
import React, { useEffect, useState } from "react";
import { usePlans } from "@/stores/plan";
import useVerses from "@/stores/verses";
import useUserInfo from "@/stores/userInfo";
import useStore from "@/stores/useStore";
import { useSchedules } from "@/hooks/useSchedules";
import { Plan, ScheduleItem } from "@/type/biblePlan";

const transformToPlan = (date: Date, schedules: ScheduleItem[]): Plan | null => {
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const dailyItems = schedules.filter((item) => item.date === formattedDate);

  if (dailyItems.length === 0) return null;

  return dailyItems.reduce<Plan>(
    (acc, val) => {
      return {
        index: val.index,
        daycount: val.daycount,
        date: val.date,
        lang: val.lang,
        verseRange: [
          ...acc.verseRange,
          {
            book: val.book,
            start: Number(val.start),
            end: Number(val.end),
          },
        ],
        img: val.img,
        videoId: val.videoId,
      };
    },
    {
      index: "-1",
      daycount: "",
      date: "",
      lang: "",
      verseRange: [],
      img: "",
      videoId: "",
    }
  );
};

const Calendar: React.FC = () => {
  const hasHydrated = useStore(useVerses, (state) => state._hasHydrated);
  const { setCurrentPlan } = usePlans();
  const { completedDayCountList } = useUserInfo();
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const { data: schedules = [] } = useSchedules(String(activeStartDate.getFullYear()));

  const handleActiveStartDateChange = ({ activeStartDate, view }: { activeStartDate: Date | null, view: string }) => {
    if (view === 'month' && activeStartDate) {
      setActiveStartDate(activeStartDate);
    }
  };

  const handleClickDay = (date: Date) => {
    const plan = transformToPlan(date, schedules);
    setCurrentPlan(plan);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return;

    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const targetPlan = (schedules || []).filter((p) => p.date === formattedDate);

    return targetPlan.map(({ book, start, end }, index) => {
      return (
        <div key={index}>
          {book}
          <br />
          {start}-{end}장
        </div>
      );
    });
  };

  const handleTileClassName = ({
    date,
    view,
  }: {
    date: Date;
    view: string;
  }) => {
    if (view !== "month") return;
    let className: string = "";

    const day = date.getDay() + 1;
    if (day === 1) {
      className = className + " sunday";
    }
    if (day === 7) {
      className = className + " saturday";
    }

    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const planItem = (schedules || []).find((p) => p.date === formattedDate);

    if (planItem) {
      if (completedDayCountList.includes(Number(planItem.daycount)))
        className = className + " active";
    }

    return className;
  };

  useEffect(() => {
    if (!hasHydrated || schedules.length === 0) {
      return;
    }
    // Attempt to set plan for today if available
    const today = new Date();
    const plan = transformToPlan(today, schedules);
    if (schedules[0]?.year === String(today.getFullYear())) {
      setCurrentPlan(plan);
    }
  }, [hasHydrated, schedules, setCurrentPlan]);

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
        onActiveStartDateChange={handleActiveStartDateChange}
      ></RCalendar>
    </div>
  );
};

export default Calendar;
