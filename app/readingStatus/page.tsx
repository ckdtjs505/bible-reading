
"use client";

import { readPlanByWeek } from "@/constants/readingPlanByWeek";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const OPENSHEET = "https://opensheet.elk.sh";
const KEY = "1LrUC8zEKsmAgi7pIeWUIQR8ufOd0F0nGI65ix7UMXr8";
const param = "%ED%95%A8%EC%98%A8%EC%84%B1DB";

type ReadingStatus = {
  Timestamp: string;
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


type ReadingStatusState = Person[];

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


const findReadPlanWeek = (daycount: number): number => {
  // readPlanByWeek에서 daycount으로 week값 추출
  for (let week = 0; week < readPlanByWeek.length; week++) {
    if (readPlanByWeek[week].includes(daycount)) {
      return week + 1; // 1-based week index
    }
  }
  return -1; // daycount가 없을 경우 -1 반환
};

const ReadingStatus = () => {
  const [bibleReadingStatus, setBibleReadingStatus] = useState<ReadingStatusState>([]);
  const status = useRef<HTMLDivElement>(null);
  const [member, setMember] = useState<string[]>([]);
  const [currentDaycount, setCurrentDaycount] = useState<number>(-1);
  const [currentReadPlanWeek, setCurrentReadPlanWeek] = useState<number>(-1);

  // Fetch current daycount from API
  useEffect(() => {
    const fetchDayCount = async () => {
      try {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        const res = await fetch(`/api/schedule?date=${formattedDate}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const dayIdx = Number(data[0].daycount);
          setCurrentDaycount(dayIdx);
          setCurrentReadPlanWeek(findReadPlanWeek(dayIdx));
        }
      } catch (err) {
        console.error("Failed to fetch day count", err);
      }
    };
    fetchDayCount();
  }, []);


  const onChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value;
    localStorage.setItem("memberString", value);
    const members = value.replaceAll(" ", "").split(",") || [];
    setMember(members);
  };

  useEffect(() => {
    const saveMembers = localStorage.getItem("memberString") || "";
    setMember(saveMembers.replaceAll(" ", "").split(","));
  }, []);

  const handleClick = () => {
    const fetchData = async () => {
      try {
        const allReadingStatus = await getHamonDB();

        const memberReadingStatus = member.map((name) => {
          const status = allReadingStatus.filter((data) => data.name === name);
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

        setBibleReadingStatus(memberReadingStatus);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  };

  const handleCopyClick = () => {
    const copydata = status.current?.innerText || "";
    //copydata = copydata.replace(/\n+/g, "\n\n"); // 여러 개의 줄 바꿈을 한 번으로 압축
    navigator.clipboard
      .writeText(copydata)
      .then(() => {
        console.log("클립보드에 복사되었습니다: \n", copydata);
      })
      .catch((err) => {
        console.error("클립보드 복사에 실패했습니다: ", err);
      });
  };

  return (
    <div className="text-center">
      <div className="m-2 text-center text-2xl p-2"> 함온성 매일 점검표</div>
      <div className="text-center text-lg">
        조원들의 이름을 콤마(,)로 구분하여 입력해주세요.
      </div>
      <div className="">
        <input
          onChange={onChangeHandle}
          className="border py-1.5 rounded-md"
          placeholder="강대범, 강성철, 김성룡, 김재섭, 김준걸, 박용우, 오창선, 이재문, 주명성"
          value={member}
        />
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-2 rounded-md bg-blue-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner"
        >
          불러오기
        </button>
      </div>
      <div>
        1조 : 강대범, 강성철, 김성룡, 김재섭, 김준걸, 박용우, 오창선, 이재문,
        주명성
      </div>

      <div className="border-black m-2">
        <div
          className="whitespace-pre border border-black w-52 m-auto text-left rounded-md p-2"
          ref={status}
        >
          <div>🏆구약 {currentReadPlanWeek}주차 매일 점검표🏆</div>
          <br />
          <span>{Array(15).fill("\u00A0").join("")}월 화 수 목 금 토 </span>
          {bibleReadingStatus.map((member, idx) => {
            return (
              <div key={idx}>
                {String(idx + 1).padStart(2, "0")}. {member.name}{" "}
                {member.readingStatus.join(" ")}
              </div>
            );
          })}
          <br />
          <span className="text-center">
            총 {bibleReadingStatus?.length}명 중
            {
              bibleReadingStatus?.filter(
                (user) => user.readingStatus[(currentDaycount % 6) - 1] === "O",
              ).length
            }
            명 완료🙏🏼
          </span>
        </div>
        <button
          onClick={handleCopyClick}
          className="inline-flex items-center gap-2 rounded-md bg-blue-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner"
        >
          복사 하기
        </button>
      </div>
    </div>
  );
};

export default ReadingStatus;
