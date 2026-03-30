"use client";

import { useState, useRef, useEffect } from "react";
import { useSchedules } from "@/hooks/useSchedules";
import { useDailyVerse } from "@/hooks/useDailyVerse";
import { useFontLevel } from "@/stores/font";
import { usePlans } from "@/stores/plan";
import { useReceivedMessages } from "@/stores/todayMessage";
import useStore from "@/stores/useStore";
import useUserInfo from "@/stores/userInfo";
import useVerses from "@/stores/verses";
import { useTTS } from "@/hooks/useTTS";
import TTSPlayer from "@/components/TTSPlayer";

const Verses = () => {
  const fontLevel = useStore(useFontLevel, (state) => state.fontLevel);
  const level = useStore(useFontLevel, (state) => state.level) || 0;
  const userName = useStore(useUserInfo, (state) => state.userName);
  const bible = useStore(useVerses, (state) => state.bible);
  const { setBible } = useVerses();
  const { setFontLevel } = useFontLevel();
  const { currentPlan } = usePlans();

  const { data: content = [], isLoading } = useDailyVerse(
    currentPlan,
    bible || "revised"
  );

  const tts = useTTS();
  const [showTTS, setShowTTS] = useState(false);
  const [verseIndexMap, setVerseIndexMap] = useState<Map<string, { start: number; end: number }>>(new Map());
  const activeVerseIdRef = useRef<string | null>(null);

  // 날짜(currentPlan)나 성경 버전이 바뀔 때 기존 TTS 재생을 취소하고 컨트롤 바를 숨김처리합니다.
  useEffect(() => {
    tts.stop();
    setShowTTS(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlan?.date, bible]);

  useEffect(() => {
    if (!tts.isPlaying) return;
    
    let foundId = null;
    for (const [key, bounds] of verseIndexMap.entries()) {
      if (tts.charIndex >= bounds.start && tts.charIndex < bounds.end) {
        foundId = `verse-${key}`;
        break;
      }
    }
    
    if (foundId && foundId !== activeVerseIdRef.current) {
       activeVerseIdRef.current = foundId;
       const el = document.getElementById(foundId);
       if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
       }
    }
  }, [tts.charIndex, tts.isPlaying, verseIndexMap]);

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
            className={`rounded-full mr-2 border-none transition ${bible === "revised" ? "active" : ""} ${tts.isPlaying && bible !== "revised" ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (tts.isPlaying) return;
              setBible("revised");
            }}
          >
            개역개정
          </button>
          <button
            id="korean"
            className={`rounded-full mr-2 border-none transition ${bible === "woorimal" ? "active" : ""} ${tts.isPlaying && bible !== "woorimal" ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (tts.isPlaying) return;
              setBible("woorimal");
            }}
          >
            우리말 성경
          </button>
          <button
            id="newHangul"
            className={`rounded-full mr-2 border-none transition ${bible === "newHangul" ? "active" : ""} ${tts.isPlaying && bible !== "newHangul" ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (tts.isPlaying) return;
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

        {/* 재생/중지 버튼 그룹 */}
        <div id="tts" className="flex w-12 ml-2">
          <button
            className="btn cursor-pointer w-12 border border-blue-400 bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition rounded-md"
            onClick={() => {
              if (tts.isPlaying) {
                tts.stop();
                setShowTTS(false);
              } else {
                if (!content || content.length === 0) return;
                let accumulatedText = "";
                const newVerseIndexMap = new Map<string, { start: number; end: number }>();
                const ttsChunks: { text: string; start: number; end: number }[] = [];

                content.forEach((c, cIdx) => {
                  const bookIntro = c.book.replaceAll('\\n', '');
                  const introText = `${bookIntro}. `;
                  ttsChunks.push({
                    text: introText,
                    start: accumulatedText.length,
                    end: accumulatedText.length + introText.length
                  });
                  accumulatedText += introText;
                  
                  c.verses?.forEach((v, vIdx) => {
                    const startIdx = accumulatedText.length;
                    let vText = `${v.message}`;
                    
                    if (vIdx !== c.verses.length - 1) {
                      vText += " ";
                    } else if (cIdx !== content.length - 1) {
                      vText += " ";
                    }
                    
                    ttsChunks.push({
                      text: vText,
                      start: startIdx,
                      end: startIdx + vText.length
                    });
                    
                    accumulatedText += vText;
                    
                    newVerseIndexMap.set(`${c.book}-${v.chapter}-${v.verse}`, {
                      start: startIdx,
                      end: accumulatedText.length
                    });
                  });
                });

                setVerseIndexMap(newVerseIndexMap);
                const isSuccess = tts.play(accumulatedText, ttsChunks);
                if (isSuccess) {
                  setShowTTS(true);
                }
              }
            }}
            title={tts.isPlaying ? "듣기 중지" : "말씀 듣기"}
          >
            {tts.isPlaying ? "⏹️" : "🔊"}
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
                  const verseKey = `${book}-${chapter}-${verse}`;
                  const bounds = verseIndexMap.get(verseKey);
                  const isReading =
                    tts.isPlaying &&
                    bounds &&
                    tts.charIndex >= bounds.start &&
                    tts.charIndex < bounds.end;

                  return (
                    <div key={index}>
                      <div>
                        <span
                          id={`verse-${verseKey}`}
                          className={`
                            ${messages?.[currentPlan.date]?.some((msg) => msg.book === book && msg.chapter === chapter && msg.verse === verse) ? "select" : ""}
                            ${isReading ? "underline decoration-blue-500 decoration-2 underline-offset-4 bg-blue-50 transition-colors" : ""}
                          `}
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

      {showTTS && (
        <TTSPlayer tts={tts} onClose={() => setShowTTS(false)} />
      )}
    </div>
  );
};

export default Verses;
