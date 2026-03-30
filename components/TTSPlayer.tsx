"use client";

import { useTTS } from "@/hooks/useTTS";
import { useState } from "react";

interface TTSPlayerProps {
  tts: ReturnType<typeof useTTS>;
  onClose: () => void;
}

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function TTSPlayer({ tts, onClose }: TTSPlayerProps) {
  const { 
    isPlaying, isPaused, progress, rate, 
    currentTime, totalTime,
    resume, pause, stop, changeRate, seekTo 
  } = tts;

  const [localProgress, setLocalProgress] = useState<number | null>(null);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalProgress(Number(e.target.value));
  };

  const handleSeekEnd = () => {
    if (localProgress !== null) {
      seekTo(localProgress);
      setLocalProgress(null);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl p-5 z-50 transition-all duration-300">
      
      {/* Progress Bar & Time */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-2 px-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalTime)}</span>
        </div>
        
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={localProgress !== null ? localProgress : (progress || 0)}
          onChange={handleSeekChange}
          onMouseUp={handleSeekEnd}
          onTouchEnd={handleSeekEnd}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${localProgress !== null ? localProgress : progress}%, #e5e7eb ${localProgress !== null ? localProgress : progress}%)`
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Speed Control */}
        <div className="flex bg-gray-50 rounded-xl p-1">
          {[1.0, 1.2, 1.5].map((speed) => (
            <button
              key={speed}
              onClick={() => changeRate(speed)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                rate === speed 
                  ? "bg-white text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              x{speed}
            </button>
          ))}
        </div>

        {/* Main Controls */}
        <div className="flex items-center gap-3">
          {(!isPlaying || isPaused) ? (
            <button 
              onClick={resume} 
              className="p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="재생"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <button 
              onClick={pause} 
              className="p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              title="일시정지"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          <button 
            onClick={() => { stop(); onClose(); }}
            className="p-3 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            title="정지 및 닫기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
