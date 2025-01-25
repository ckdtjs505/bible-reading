"use client";

import { usePlan } from "@/stores/plan";
import { useTodayMessage } from "@/stores/todayMessage";
import { useState } from "react";

const PlayerJournal = () => {
  const { selectDayPlan } = usePlan();
  const { message } = useTodayMessage();

  const [isShowPlayForUserCheckBox, setIsShowPlayForUserCheckBox] =
    useState(false);

  const [isShowPray, setIsShowPray] = useState(false);
  return (
    <div>
      <div className="p-4 border-b border-t border-black">
        <div className="font-bold">
          ✔️ 함온성 설정
          <span className="text-xs"> (네모박스를 클릭하면 활성화됩니다) </span>
        </div>
        <div>
          <div>
            <input
              type="checkbox"
              id="prayForUserCheckBox"
              onClick={() => setIsShowPlayForUserCheckBox((isShow) => !isShow)}
            />
            <label htmlFor="prayForUserCheckBox"> 💝앞사람을 위한 기도</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="prayCheckBox"
              onClick={() => setIsShowPray((isShow) => !isShow)}
            />
            <label htmlFor="prayCheckBox"> 🌼 한줄 기도하기</label>
          </div>
        </div>
      </div>
      <div id="userContent" className="p-4">
        <div id="submitdata">
          {isShowPlayForUserCheckBox && (
            <div id="prayForUser">
              💝앞사람을 위한 기도 :
              <textarea
                id="prayForUserText"
                className="w-full h-20 border border-black"
              ></textarea>
            </div>
          )}
          <div>
            🌼 이름 : <span id="name">오창선</span>
          </div>
          📖 오늘 내게 주신 말씀 : <br />
          <div id="myMessage">
            {message.map((value, index) => {
              return (
                <div key={index}>
                  {value} <br />
                </div>
              );
            })}
          </div>
          {isShowPray && (
            <div id="prayBox">
              🙏 한줄 기도 :
              <textarea
                id="pray"
                className="w-full h-20 border border-black"
              ></textarea>
            </div>
          )}
          제 <span id="day">{selectDayPlan.daycount}</span> 일차 완료했습니다.{" "}
          <br />
        </div>

        <button id="saveButton" type="button">
          복사하기
        </button>
        <button id="changeName" type="button">
          이름바꾸기
        </button>
      </div>
    </div>
  );
};

export default PlayerJournal;
