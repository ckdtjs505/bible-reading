"use client";

import { useSchedules } from "@/hooks/useSchedules";
import { useDailyVerse } from "@/hooks/useDailyVerse";
import { useFontLevel } from "@/stores/font";
import { usePlans } from "@/stores/plan";
import { useReceivedMessages } from "@/stores/todayMessage";
import useStore from "@/stores/useStore";
import useVerses from "@/stores/verses";

const Verses = () => {
  const fontLevel = useStore(useFontLevel, (state) => state.fontLevel);
  const level = useStore(useFontLevel, (state) => state.level) || 0;
  const bible = useStore(useVerses, (state) => state.bible);
  const { setBible } = useVerses();
  const { setFontLevel } = useFontLevel();
  const { currentPlan } = usePlans();

  const { data: content = [], isLoading } = useDailyVerse(
    currentPlan,
    bible || "revised"
  );

  const messages = useStore(useReceivedMessages, (state) => state.messages);
  const { addMessage, removeMessage } = useReceivedMessages();

  const handleToggleMessage = ({
    book,
    chapter,
    verse,
    content,
  }: {
    book: string;
    chapter: number;
    verse: number;
    content: string;
  }) => {
    // ID(권, 장, 절)를 기반으로 메시지가 존재하는지 확인
    if (!currentPlan) return;

    const isSelected = messages?.[currentPlan.date]?.some(
      (msg) =>
        msg.book === book && msg.chapter === chapter && msg.verse === verse,
    );

    if (isSelected) {
      removeMessage(currentPlan.date, { book, chapter, verse });
    } else {
      addMessage(currentPlan.date, { book, chapter, verse, content });
    }
  };

  /* 
   * 현재 연도의 일정 로딩 상태를 확인합니다.
   * 이는 달력이 초기 데이터를 가져오는 동안 앱 로드 시 즉시 '일정 없음'이 표시되는 것을 방지하기 위함입니다.
   */
  const currentYear = new Date().getFullYear().toString();
  const { isLoading: isScheduleLoading } = useSchedules(currentYear);

  if (isLoading) return <div className="p-4 text-center"> 말씀 가져오는 중 </div>;

  // 계획이 없지만 현재 일정을 로딩 중이라면 로딩 메시지를 표시
  if (!currentPlan && isScheduleLoading) {
    return <div className="p-4 text-center"> 일정을 불러오는 중... </div>;
  }

  if (!currentPlan || currentPlan.index === "-1") {
    return <div className="p-4 text-xl text-center"> 함온성이 없는 날 입니다. </div>;
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
          <button
            id="newHangul"
            className={`rounded-full  mr-2 border-none transition ${bible === "newHangul" ? "active" : ""}`}
            onClick={() => {
              setBible("newHangul");
            }}
          >
            새한글 성경
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
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          content.map(({ book, verses }, idx) => {
            return (
              <div key={idx}>
                <div className="font-bold"> {book.replaceAll('\\n', '')}</div>
                {verses?.map(({ chapter, verse, message }, index) => {
                  return (
                    <div key={index}>
                      <div>
                        <span
                          className={
                            messages?.[currentPlan.date]?.some(
                              (msg) =>
                                msg.book === book &&
                                msg.chapter === chapter &&
                                msg.verse === verse,
                            )
                              ? "select"
                              : ""
                          }
                          onClick={() =>
                            handleToggleMessage({
                              book,
                              chapter,
                              verse,
                              content: message || "",
                            })
                          }
                        >
                          {chapter}:{verse} {message}
                        </span>
                      </div>
                      <br />
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Verses;
