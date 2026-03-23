"use client";

import useDialogStore from "@/stores/dialogStore";
import { useEffect, useState } from "react";

const MyWordsButton = () => {
  const { openDialog } = useDialogStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return (
    <button
      className="fixed bottom-20 right-5 bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg transition-colors z-40 flex items-center justify-center"
      onClick={() => openDialog("myWords")}
      title="내게 주신 말씀 모아보기"
    >
      <span className="text-xl">📜</span>
    </button>
  );
};

export default MyWordsButton;
