"use client";

import { member } from "@/constants/member";
import { plan } from "@/constants/plan";
import { readPlanByWeek } from "@/constants/readingPlanByWeek";
import { useRef, useState } from "react";

const OPENSHEET = "https://opensheet.elk.sh";
const KEY = "1LrUC8zEKsmAgi7pIeWUIQR8ufOd0F0nGI65ix7UMXr8";
const param = "%ED%95%A8%EC%98%A8%EC%84%B1DB";

type ReadingStatus = {
  Timestamp: Date;
  name: string;
  daycnt: string;
  myMessage: string;
  pray: string;
}[];

type Status = "O" | "X" | " ";

type Person = {
  name: string;
  readingStatus: Status[];
};

type Team = Person[];

type ReadingStatusState = Team[];

const getHamonDB = async (): Promise<ReadingStatus> => {
  const response = await fetch(`${OPENSHEET}/${KEY}/${param}`, {
    redirect: "follow",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
  });

  if (!response.ok) {
    throw Error("response error");
  }

  return await response.json();
};

const getCurrentDaycount = (date: Date): number => {
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const currentPlan = plan.find((info) => info.date === formattedDate);

  return currentPlan ? Number(currentPlan.daycount) : -1;
};

// 날자를 입력할수 있도록 해야하나?
// 오늘 날자로 하니까 함온성이 없는 날에 이슈가 발생함.
const findReadPlanWeek = (daycount: number): number => {
  // readPlanByWeek에서 daycount으로 week값 추출
  for (let week = 0; week < readPlanByWeek.length; week++) {
    if (readPlanByWeek[week].includes(daycount)) {
      return week + 1; // 1-based week index
    }
  }
  return -1; // daycount가 없을 경우 -1 반환
};

const currentDaycount = getCurrentDaycount(new Date("2025-02-03"));
const currentReadPlanWeek = findReadPlanWeek(currentDaycount);

const ReadingStatus = () => {
  const [bibleReadingStatus, setBibleReadingStatus] =
    useState<ReadingStatusState>([]);

  const textRef = useRef<HTMLDivElement>(null);
  const handleClick = () => {
    const fetchData = async () => {
      try {
        const allReadingStatus = await getHamonDB();

        const memberReadingStatus = member.map((team) => {
          return team.map((name) => {
            const status = allReadingStatus.filter(
              (data) => data.name === name,
            );
            const result = readPlanByWeek[currentReadPlanWeek - 1].map(
              (dayCount) => {
                if (dayCount <= currentDaycount) {
                  const idx = status.findIndex((val) => {
                    return Number(val.daycnt) === dayCount;
                  });

                  return idx === -1 ? "X" : "O";
                } else {
                  return " ";
                }
              },
            );

            return {
              name: name,
              readingStatus: result,
            };
          });
        });

        setBibleReadingStatus(memberReadingStatus);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  };


  const handleCopyClick = () => {

    if(!textRef.current ) return;
  const copydata = textRef.current.innerText || "";
    navigator.clipboard
      .writeText(copydata)
      .then(() => {
        console.log("클립보드에 복사되었습니다: \n", copydata );
      })
      .catch((err) => {
        console.error("클립보드 복사에 실패했습니다: ", err);
      });
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className="border border-black m-2 rounded-lg bg-blue-200"
      >
        1조 진행사항 가져오기
      </button>
      <div ref={textRef} className="border-black m-2">
        <div>🏆구약 {currentReadPlanWeek}주차 매일 점검표🏆</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;월 화 수 목 금 토  </div>
        {bibleReadingStatus.map((data) => {
          return data.map((member, idx) => {
            return (
              <div key={idx}>
                {idx + 1}. {member.name} {member.readingStatus.join(" ")}
              </div>
            );
          });
        })}
        <div>
          총 {bibleReadingStatus[0]?.length}명 중
          {
            bibleReadingStatus[0]?.filter(
              (user) => user.readingStatus[currentDaycount % 6 - 1] === "O",
            ).length
          }
          명 완료🙏🏼
        </div>
      </div>
      <button onClick={handleCopyClick} className="m-2">
        복사 하기
      </button>
    </div>
  );
};

export default ReadingStatus;
