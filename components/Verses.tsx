"use client";

import { getDailyVerse } from "@/pages/api/bible";
import { useFontLevel } from "@/stores/font";
import { usePlans } from "@/stores/plan";
import { useReceivedMessages } from "@/stores/todayMessage";
import useStore from "@/stores/useStore";
import useVerses from "@/stores/verses";
import { useEffect } from "react";

const Verses = () => {
  const fontLevel = useStore(useFontLevel, (state) => state.fontLevel);
  const level = useStore(useFontLevel, (state) => state.level) || 0;
  const bible = useStore(useVerses, (state) => state.bible);
  const { setFontLevel } = useFontLevel();
  const { verses, book, setBible, setVerses, setBook } = useVerses();
  const { currentPlan } = usePlans();

  const messages = useStore(useReceivedMessages, (state) => state.messages);

  const { addMessage, removeMessage } = useReceivedMessages();

  const handleClickMessage = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event?.target as HTMLElement;

    if (target.classList.contains("select")) {
      removeMessage(currentPlan.date, target.innerText);
    } else {
      addMessage(currentPlan.date, target.innerText);
    }
  };

  useEffect(() => {
    const { index, book, start, end } = currentPlan;

    if (index !== "-1") {
      const verses = getDailyVerse({
        book,
        start: Number(start),
        end: Number(end),
        bible: bible || "revised",
      });

      setVerses(verses);
      setBook(book);
    } else {
      setVerses([]);
      setBook("");
    }
  }, [bible, currentPlan, setVerses, setBook]);

  if (currentPlan.index === "-1") {
    return <div className="p-4"> 함온성이 없는 날 입니다. </div>;
  }

  return (
    <div className="p-4 text-2xl">
      <div className="flex justify-end text-sm h-8">
        {/* 성경 타입 버튼 그룹 */}
        <div id="bibleType" className="flex text-[0.7rem]">
          <button
            id="kiv"
            className={`rounded-full mr-2  border-none bg-transparent transition ${bible === "revised" ? "active" : ""}`}
            onClick={() => {
              setBible("revised");
            }}
          >
            개역개정
          </button>
          <button
            id="korean"
            className={`rounded-full  mr-2 border-none transition ${bible === "woorimal" ? "active" : ""}`}
            onClick={() => {
              setBible("woorimal");
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
        {verses?.map(({ chapter, verse, message: content }, index) => {
          return (
            <div key={index}>
              <div>
                <span
                  className={
                    messages?.[currentPlan.date]
                      ?.map(({ message }) => message)
                      .includes(`${chapter}:${verse} ${content}`)
                      ? "select"
                      : ""
                  }
                  onClick={handleClickMessage}
                >
                  {chapter}:{verse} {content}
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
