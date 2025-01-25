"use client";

import { useTodayMessage } from "@/stores/todayMessage";

const PlayerJournal = () => {
  const { message } = useTodayMessage();

  return (
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
            {message.map((value, index) => {
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
  );
};

export default PlayerJournal;
