"use client";

import { useState, useEffect, useRef } from "react";

// 한국어 기본 읽기 속도 추정 (1.0x 기준 초당 약 12~15 글자)
const CHARS_PER_SECOND = 14;

if (typeof window !== "undefined" && !(window as any)._speechHackApplied) {
  (window as any)._speechHackApplied = true;
  const originalCancel = window.speechSynthesis.cancel.bind(window.speechSynthesis);

  window.speechSynthesis.cancel = function () {
    if ((window as any)._allowSpeechCancel) {
      originalCancel();
      (window as any)._allowSpeechCancel = false;
    } else {
      console.warn("Blocked an unauthorized call to speechSynthesis.cancel()!");
    }
  };
}

const safeCancel = () => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    (window as any)._allowSpeechCancel = true;
    window.speechSynthesis.cancel();
  }
};

export const useTTS = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [rate, setRate] = useState(1.0);

  // 시간 관련된 상태
  const [currentTime, setCurrentTime] = useState(0); // 초 단위
  const [totalTime, setTotalTime] = useState(0);     // 초 단위

  // 전체 텍스트 보관
  const fullTextRef = useRef("");
  // 현재 읽고 있는 인덱스 (일시정지 후 속도변경 시 사용)
  const currentIndexRef = useRef(0);
  const currentUtteranceRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      // React 18+의 리렌더링 혹은 강제 언마운트-리마운트 사이클에서 
      // TTS가 의도치 않게 취소되는 버그를 막기 위해 언마운트 시 자동 cancel()을 제거합니다.
      /*
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      */
    };
  }, []);

  // 전체 시간 예측 (텍스트 길이 / (기본 초당 글자 수 * 배속))
  const calculateEstimatedTotalTime = (textLen: number, currentRate: number) => {
    return textLen / (CHARS_PER_SECOND * currentRate);
  };

  const playFromIndex = (text: string, startIndex: number, currentRate: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (currentUtteranceRef.current) {
      currentUtteranceRef.current._intentToStop = true;
    }
    safeCancel();

    const remainingText = text.substring(startIndex);
    if (!remainingText) return;

    const utterance: any = new SpeechSynthesisUtterance(remainingText);
    utterance._intentToStop = false;
    currentUtteranceRef.current = utterance;

    // 브라우저(특히 Safari/Chrome) GC 버그 완벽 방지: 배열에 담아 영구 참조 유지
    if (typeof window !== "undefined") {
      const globalWindow = window as any;
      if (!globalWindow._speechUtterances) {
        globalWindow._speechUtterances = [];
      }
      globalWindow._speechUtterances.push(utterance);
    }

    utterance.lang = "ko-KR";
    utterance.rate = currentRate;

    // 전체 예상 시간 계산
    const totalEstTime = calculateEstimatedTotalTime(text.length, currentRate);
    setTotalTime(totalEstTime);

    utterance.onboundary = (e: any) => {
      const globalIndex = startIndex + e.charIndex;
      currentIndexRef.current = globalIndex;
      setCharIndex(globalIndex);

      if (text.length > 0) {
        const currentProgress = (globalIndex / text.length) * 100;
        setProgress(Math.min(currentProgress, 100));
        setCurrentTime((currentProgress / 100) * totalEstTime);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      setCharIndex(0);
      setCurrentTime(totalEstTime);
      currentIndexRef.current = 0;
    };

    utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
      console.log("TTS Error Event: ", e.error);
      
      if (!utterance._intentToStop && (e.error === "canceled" || e.error === "interrupted")) {
        console.warn("TTS was unexpectedly interrupted! Auto-resuming from index: ", currentIndexRef.current);
        setTimeout(() => {
          playFromIndex(fullTextRef.current, currentIndexRef.current, rate);
        }, 50);
        return; // 상태 변경 방지
      }

      if (e.error !== "canceled" && e.error !== "interrupted") {
        console.error("TTS Real Error: ", e);
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const playToRead = (text: string) => {
    fullTextRef.current = text;
    currentIndexRef.current = 0;
    setProgress(0);
    setCharIndex(0);
    setCurrentTime(0);
    playFromIndex(text, 0, rate);
  };

  const pause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stop = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    if (currentUtteranceRef.current) {
      currentUtteranceRef.current._intentToStop = true;
    }
    safeCancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setCharIndex(0);
    setCurrentTime(0);
    currentIndexRef.current = 0;
  };

  const changeRate = (newRate: number) => {
    setRate(newRate);
    if (isPlaying && !isPaused) {
      playFromIndex(fullTextRef.current, currentIndexRef.current, newRate);
    } else if (fullTextRef.current) {
      // 일시 정지 중인 경우 총 시간 재계산
      setTotalTime(calculateEstimatedTotalTime(fullTextRef.current.length, newRate));
    }
  };

  const seekTo = (percentage: number) => {
    if (!fullTextRef.current) return;

    // 퍼센트를 글자 수 인덱스로 변환
    const targetIndex = Math.floor((percentage / 100) * fullTextRef.current.length);
    currentIndexRef.current = targetIndex;

    setProgress(percentage);
    setCharIndex(targetIndex);
    setCurrentTime((percentage / 100) * totalTime);

    // 만약 완전히 종료된 상태라면 처음부터가 아닌 해당 위치부터 시작하도록 바로 재생
    if (!isPlaying && !isPaused) {
      playFromIndex(fullTextRef.current, targetIndex, rate);
    } else {
      // 이미 진행중 (또는 일시정지중) 이라면
      if (!isPaused) {
        playFromIndex(fullTextRef.current, targetIndex, rate);
      } else {
        // 일시정지 중이면 재생하지 않고 위치만 변경한 채 멈춰두기 위해 Cancel
        if (currentUtteranceRef.current) {
          currentUtteranceRef.current._intentToStop = true;
        }
        safeCancel();
      }
    }
  };

  return {
    play: playToRead,
    pause,
    resume,
    stop,
    changeRate,
    seekTo,
    isPlaying,
    isPaused,
    progress,
    charIndex,
    rate,
    currentTime,
    totalTime
  };
};
