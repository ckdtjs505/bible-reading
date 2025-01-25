"use client";

import { usePlan } from "@/stores/plan";
import { useTodayMessage } from "@/stores/todayMessage";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { useState } from "react";

const PlayerJournal = () => {
  const { selectDayPlan } = usePlan();
  const { message } = useTodayMessage();
  const [isShowPlayForUserCheckBox, setIsShowPlayForUserCheckBox] = useState(
    getLocalStorage("isShowPlayForUserCheckBox"),
  );

  const [isShowPray, setIsShowPray] = useState(getLocalStorage("isShowPray"));
  const [prayForUser, setPrayForUser] = useState("");
  const [pray, setPray] = useState("");

  const handleSaveButton = () => {
    const myMessage = message.join("\n");
    const copyData =
      (isShowPlayForUserCheckBox
        ? `💝앞사람을  위한 기도 \n${prayForUser}\n\n`
        : "") +
      `🌸 이름 : 오창선 \n\n` +
      `📖 오늘 내게 주신 말씀 \n${myMessage}\n\n` +
      (isShowPray ? `🙏 한줄기도 \n${pray} \n\n` : "") +
      `제 ${selectDayPlan.daycount}일차 완료했습니다.`;

    navigator.clipboard
      .writeText(copyData)
      .then(() => {
        console.log("클립보드에 복사되었습니다: \n" + copyData);
        //if (!name) return;
        if (!myMessage) return;
        // BibleReadingSaveService.setSaveMessage({
        //   prayForUser,
        //  name,
        // myMessage,
        // day: AppState.getInstance().readingPlan[0]?.dayCount,
        //pray,
        // });
      })
      .catch((err) => {
        console.error("클립보드 복사에 실패했습니다: ", err);
      });
  };

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
              checked={isShowPlayForUserCheckBox}
              onChange={() =>
                setIsShowPlayForUserCheckBox((isShow: boolean) => {
                  setLocalStorage("isShowPrayForUser", !isShow);

                  return !isShow;
                })
              }
            />
            <label htmlFor="prayForUserCheckBox"> 💝앞사람을 위한 기도</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="prayCheckBox"
              checked={isShowPray}
              onChange={() =>
                setIsShowPray((isShow: boolean) => {
                  setLocalStorage("isShowPray", JSON.stringify(!isShow));
                  return !isShow;
                })
              }
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
                value={prayForUser}
                id="prayForUserText"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPrayForUser(e.target.value)
                }
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
                value={pray}
                id="pray"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPray(e.target.value)
                }
                className="w-full h-20 border border-black"
              ></textarea>
            </div>
          )}
          제 <span id="day">{selectDayPlan.daycount}</span> 일차 완료했습니다.
          <br />
        </div>

        <button id="saveButton" type="button" onClick={handleSaveButton}>
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
