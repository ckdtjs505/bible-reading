"use client";

import { useFontLevel } from "@/stores/font";
import { useTodayMessage } from "@/stores/todayMessage";
import useStore from "@/stores/useStore";
import useVerses from "@/stores/verses";

const Verses = () => {
  const fontLevel = useStore(useFontLevel, (state) => state.fontLevel);
  const level = useStore(useFontLevel, (state) => state.level) || 0;

  const { setFontLevel } = useFontLevel();
  const { verses, book, bible, updateBible } = useVerses();
  const { message: messages, add, remove } = useTodayMessage();

  const handleClickMessage = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event?.target as HTMLElement;

    if (target.classList.contains("active")) {
      remove(target.innerText);
    } else {
      add(target.innerText);
    }
  };

  return (
    <div className="p-4 text-2xl">
      <div className="flex justify-end text-sm h-8">
        {/* 성경 타입 버튼 그룹 */}
        <div id="bibleType" className="flex text-[0.7rem]">
          <button
            id="kiv"
            className={`rounded-full mr-2  border-none bg-transparent transition ${bible === "newBible" ? "active" : ""}`}
            onClick={() => {
              updateBible({
                bible: "newBible",
              });
            }}
          >
            개역개정
          </button>
          <button
            id="korean"
            className={`rounded-full mr-2 border-none transition ${bible === "koreanBible" ? "active" : ""}`}
            onClick={() => {
              updateBible({
                bible: "koreanBible",
              });
            }}
          >
            우리말 성경
          </button>
        </div>

        {/* 글꼴 크기 버튼 그룹 */}
        <div id="fontSize" className="flex w-20">
          <button
            id="larger"
            className="btn cursor-pointer w-12 border border-gray-300 text-center hover:bg-gray-100 transition"
            onClick={() => {
              setFontLevel(level + 1);
            }}
          >
            +
          </button>
          <button
            id="smaller"
            className="btn cursor-pointer w-12 border border-gray-300 text-center hover:bg-gray-100 transition"
            onClick={() => {
              setFontLevel(level - 1);
            }}
          >
            -
          </button>
        </div>
      </div>

      <div className={fontLevel}>
        <div>{book}</div>
        {verses?.map(({ chapter, verse, message }, index) => {
          return (
            <div key={index}>
              <div>
                <span
                  className={
                    messages.includes(`${chapter}:${verse} ${message}`)
                      ? "active"
                      : ""
                  }
                  onClick={handleClickMessage}
                >
                  {chapter}:{verse} {message}
                </span>
              </div>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Verses;
