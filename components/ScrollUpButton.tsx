"use client";

import { useEffect, useRef, useState } from "react";

const ScrollButton = () => {
  const [showButton, setShowButton] = useState(false);
  const lastScrollY = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // 스크롤 위치가 300px 이상일 때 버튼 표시
      if (currentScrollY < lastScrollY.current && currentScrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
      lastScrollY.current = currentScrollY;
    };

    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", handleScroll);

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {showButton && (
        <button
          className="fixed bottom-5 right-5 bg-gray-200 text-white p-3  rounded-3xl shadow-lg"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          <img src="/free-icon-up-arrow.png" className="size-4"></img>
        </button>
      )}
    </div>
  );
};

export default ScrollButton;
