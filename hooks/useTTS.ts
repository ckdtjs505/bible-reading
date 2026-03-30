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
  const lastBoundaryTimeRef = useRef(0);

  useEffect(() => {
    // 안드로이드 크롬 등 비동기로 목소리 목록을 로딩하는 브라우저를 위해 사전 로드
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    return () => {
      // React 18+의 리렌더링 혹은 강제 언마운트-리마운트 사이클에서 
      // TTS가 의도치 않게 취소되는 버그를 막기 위해 언마운트 시 자동 cancel()을 제거합니다.
    };
  }, []);

  // 안드로이드 등에서 onboundary 이벤트가 발생하지 않는 기기를 위한 타이머 폴백
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isPaused && totalTime > 0 && fullTextRef.current) {
      interval = setInterval(() => {
        const now = Date.now();
        // 마지막 onboundary 발생 후 1초 이상 지났다면 이벤트를 지원하지 않거나 렉이 걸린 것으로 간주하여 타이머로 대체
        const isBoundaryAlive = now - lastBoundaryTimeRef.current < 1000;
        
        if (isBoundaryAlive) {
          return;
        }

        setCurrentTime((prev) => {
          const newTime = prev + 0.1;
          const clampedTime = newTime > totalTime ? totalTime : newTime;
          
          const progressPercent = (clampedTime / totalTime) * 100;
          setProgress(progressPercent);
          
          const textLen = fullTextRef.current.length;
          const estimatedCharIndex = Math.floor((clampedTime / totalTime) * textLen);
          
          setCharIndex((prevIdx) => {
            const newIdx = Math.max(prevIdx, estimatedCharIndex);
            currentIndexRef.current = newIdx;
            return newIdx;
          });
          
          return clampedTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, totalTime]);

  // 전체 시간 예측 (텍스트 길이 / (기본 초당 글자 수 * 배속))
  const calculateEstimatedTotalTime = (textLen: number, currentRate: number) => {
    return textLen / (CHARS_PER_SECOND * currentRate);
  };

  const playFromIndex = (text: string, startIndex: number, currentRate: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // iOS 버그: 아무것도 안 하고 있는데 cancel()을 호출하면 다음 speak()가 씹힘
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      if (currentUtteranceRef.current) {
        currentUtteranceRef.current._intentToStop = true;
      }
      safeCancel();
    }

    const remainingText = text.substring(startIndex);
    if (!remainingText) return;

    // 모바일(특히 안드로이드 크롬)에서 텍스트가 너무 길면(대략 3000자 이상)
    // "synthesis-failed" 에러가 발생하므로 청크(chunk) 단위로 잘라서 읽게 합니다.
    const MAX_LENGTH = 1500;
    let chunk = remainingText;
    let isLastChunk = true;
    
    if (chunk.length > MAX_LENGTH) {
      isLastChunk = false;
      let splitIndex = MAX_LENGTH;
      // 안전하게 나눌 수 있는 구두점이나 공백을 찾습니다.
      const safeTokens = [". ", "? ", "! ", "\n", ", ", " "];
      for (const token of safeTokens) {
        const lastIndex = chunk.lastIndexOf(token, MAX_LENGTH);
        if (lastIndex > MAX_LENGTH * 0.5) { // 너무 짧게 잘라지는 것을 방지
          splitIndex = lastIndex + token.length;
          break;
        }
      }
      chunk = chunk.substring(0, splitIndex);
    }

    const utterance: any = new SpeechSynthesisUtterance(chunk);
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
    
    // 모바일 환경(특히 iOS Safari)에서는 목소리를 명시적으로 지정하지 않으면 안 읽히는 버그 방지
    const voices = window.speechSynthesis.getVoices();
    const koVoice = voices.find((v) => v.lang === "ko-KR" || v.lang === "ko_KR" || v.name.includes("Korean") || v.name.includes("한국어"));
    if (koVoice) {
      utterance.voice = koVoice;
    }
    
    utterance.rate = currentRate;

    // 전체 예상 시간 계산
    const totalEstTime = calculateEstimatedTotalTime(text.length, currentRate);
    setTotalTime(totalEstTime);

    utterance.onboundary = (e: any) => {
      lastBoundaryTimeRef.current = Date.now();
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
      if (utterance._intentToStop) return;

      if (!isLastChunk) {
        // 다음 청크 이어서 바로 재생
        const nextStartIndex = startIndex + chunk.length;
        currentIndexRef.current = nextStartIndex;
        setTimeout(() => {
          playFromIndex(fullTextRef.current, nextStartIndex, currentRate);
        }, 10);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
        setCharIndex(0);
        setCurrentTime(totalEstTime);
        currentIndexRef.current = 0;
      }
    };

    utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
      console.log("TTS Error Event: ", e.error);
      
      if (!utterance._intentToStop && (e.error === "canceled" || e.error === "interrupted")) {
        console.warn("TTS was unexpectedly interrupted! Auto-resuming from index: ", currentIndexRef.current);
        setTimeout(() => {
          playFromIndex(fullTextRef.current, currentIndexRef.current, currentRate);
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
      lastBoundaryTimeRef.current = Date.now(); // 재생 시작 시점 초기화
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const playToRead = (text: string) => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      // 카카오톡 인앱 브라우저 감지
      if (ua.includes("kakaotalk")) {
        const targetUrl = window.location.href;
        alert("카카오톡 내부에서는 음성이 지원되지 않습니다. 외부 브라우저(크롬/사파리)로 이동합니다.");
        window.location.href = "kakaotalk://web/openExternal?url=" + encodeURIComponent(targetUrl);
        return;
      }

      if (!window.speechSynthesis) {
        alert("현재 사용중인 브라우저는 음성 읽기 기능을 지원하지 않습니다. 크롬이나 사파리를 이용해주세요.");
        return;
      }
    }

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
