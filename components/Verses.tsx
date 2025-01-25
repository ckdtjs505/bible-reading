"use client";

import { useFontLevel } from "@/stores/font";
import { useTodayMessage } from "@/stores/todayMessage";
import useVerses from "@/stores/verses";

const Verses = () => {
  const { fontLevel } = useFontLevel();
  const { verses, book } = useVerses();
  const { add, remove } = useTodayMessage();

  const handleClickMessage = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event?.target as HTMLElement;

    if (target.classList.contains("active")) {
      target.classList.remove("active");
      remove(target.innerText);
    } else {
      target.classList.add("active");
      add(target.innerText);
    }
  };

  return (
    <div className="p-4 text-2xl">
      <div>{book}</div>
      {verses?.map(({ chapter, verse, message }, index) => {
        return (
          <div key={index}>
            <div className={`${fontLevel}`} onClick={handleClickMessage}>
              {chapter}:{verse} {message}
            </div>
            <br />
          </div>
        );
      })}
    </div>
  );
};

export default Verses;
