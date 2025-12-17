"use client";

import { getUserProgressInfo, setReadBible } from "@/pages/api/userInfo";
import { usePlans } from "@/stores/plan";
import { useReceivedMessages } from "@/stores/todayMessage";
import useUserInfo from "@/stores/userInfo";
import useStore from "@/stores/useStore";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useDialogStore from "@/stores/dialogStore";

import { bookKeyNumber } from "@/constants/bibleNumber";


const PrayerJournal = () => {
  const { currentPlan } = usePlans();
  const { messages } = useReceivedMessages();
  const { openDialog } = useDialogStore();

  const userName = useStore(useUserInfo, (state) => state.userName);
  const hasHydrated = useStore(useUserInfo, (state) => state._hasHydrated);
  const { addCompleteDayCountList, setCompleteDayCountList } = useUserInfo();
  const [isShowPlayForUserCheckBox, setIsShowPlayForUserCheckBox] =
    useState(false);

  const router = useRouter();
  const [isShowPray, setIsShowPray] = useState(false);
  const [prayForUser, setPrayForUser] = useState("");
  const [pray, setPray] = useState("");

  const formatDay = (daycount: number): number => {
    return daycount >= 187 ? daycount - 186 : daycount;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsShowPlayForUserCheckBox(
        getLocalStorage<boolean>("isShowPlayForUserCheckBox") || false,
      );
      setIsShowPray(getLocalStorage<boolean>("isShowPray") || false);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      console.log("loading ");
    } else {
      if (userName === "") {
        openDialog("login");
      } else {
        const fetchData = async () => {
          try {
            const info = await getUserProgressInfo(userName || "");
            setCompleteDayCountList(info.row);
          } catch (err) {
            console.log(err);
          }
        };

        fetchData();
      }
    }
  }, [userName, router, hasHydrated, openDialog, setCompleteDayCountList]);

  if (!currentPlan) {
    return <div className="p-4 text-center"> 일정을 불러오는 중입니다... </div>;
  }

  const currentMessages = messages[currentPlan.date] || [];

  const groupedMessages = currentMessages.reduce((acc, message) => {
    if (!acc[message.book]) {
      acc[message.book] = [];
    }
    acc[message.book].push(message);
    return acc;
  }, {} as Record<string, typeof currentMessages>);

  const sortedMessageEntries = Object.entries(groupedMessages).sort(
    ([bookA], [bookB]) => bookKeyNumber(bookA) - bookKeyNumber(bookB),
  );

  sortedMessageEntries.forEach(([, msgs]) => {
    msgs.sort((a, b) => {
      if (a.chapter !== b.chapter) {
        return a.chapter - b.chapter;
      }
      return a.verse - b.verse;
    });
  });


  const handleSaveButton = () => {
    console.log(messages, currentPlan)
    const myMessage = sortedMessageEntries
      .map(([book, msgs]) => {
        const verses = msgs.map(({ chapter, verse, content }) => `${chapter}:${verse} ${content}`).join("\n");
        return `${book}\n${verses}`;
      })
      .join("\n\n") || "";
    const copyData =
      (isShowPlayForUserCheckBox
        ? `💝앞사람을  위한 기도 \n${prayForUser}\n\n`
        : "") +
      `🌸 이름 : ${userName} \n\n` +
      `📖 오늘 내게 주신 말씀 \n${myMessage}\n\n` +
      (isShowPray ? `🙏 한줄기도 \n${pray} \n\n` : "") +
      `제 ${formatDay(Number(currentPlan.daycount))}일차 완료했습니다.`;

    navigator.clipboard
      .writeText(copyData)
      .then(() => {
        console.log("클립보드에 복사되었습니다: \n" + copyData);
        if (!userName) return;
        if (!myMessage) return;

        setReadBible({
          name: userName || "",
          pray: pray,
          myMessage: myMessage,
          prayForUser: prayForUser,
          daycnt: Number(currentPlan.daycount),
        });

        addCompleteDayCountList(Number(currentPlan.daycount));
      })
      .catch((err) => {
        console.error("클립보드 복사에 실패했습니다: ", err);
      });
  };

  return (
    <div>
      <div className="p-4 border-b border-t border-black">
        <div className="font-bold">
          ✔️ 함온성 설정
          <span className="text-xs"> (네모박스를 클릭하면 활성화됩니다) </span>
        </div>
        <div>
          <div>
            <input
              type="checkbox"
              id="prayForUserCheckBox"
              checked={isShowPlayForUserCheckBox}
              onChange={() =>
                setIsShowPlayForUserCheckBox((isShow: boolean) => {
                  setLocalStorage("isShowPlayForUserCheckBox", !isShow);

                  return !isShow;
                })
              }
            />
            <label htmlFor="prayForUserCheckBox"> 💝앞사람을 위한 기도</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="prayCheckBox"
              checked={isShowPray}
              onChange={() =>
                setIsShowPray((isShow: boolean) => {
                  setLocalStorage("isShowPray", !isShow);
                  return !isShow;
                })
              }
            />
            <label htmlFor="prayCheckBox"> 🌼 한줄 기도하기</label>
          </div>
        </div>
      </div>
      <div id="userContent" className="p-4">
        <div id="submitdata">
          {isShowPlayForUserCheckBox && (
            <div id="prayForUser">
              💝앞사람을 위한 기도 :
              <textarea
                value={prayForUser}
                id="prayForUserText"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPrayForUser(e.target.value)
                }
                className="w-full h-20 border border-black"
              ></textarea>
            </div>
          )}
          <div>
            🌼 이름 : <span id="name">{userName}</span>
          </div>
          📖 오늘 내게 주신 말씀 : <br />
          <div id="myMessage">
            {sortedMessageEntries.map(([book, msgs], index) => (
              <div key={index} className="mb-2">
                <div className="font-bold">{book}</div>
                {msgs.map(({ chapter, verse, content }, vIndex) => (
                  <div key={vIndex}>
                    {chapter}:{verse} {content}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {isShowPray && (
            <div id="prayBox">
              🙏 한줄 기도 :
              <textarea
                value={pray}
                id="pray"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPray(e.target.value)
                }
                className="w-full h-20 border border-black"
              ></textarea>
            </div>
          )}
          <div>
            제 <span id="day">{formatDay(Number(currentPlan.daycount))}</span> 일차 완료했습니다.
          </div>
        </div>
        <button
          id="saveButton"
          className="m-2 inline-flex items-center gap-2 rounded-md bg-blue-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
          type="button"
          onClick={handleSaveButton}
        >
          복사하기
        </button>
        <button
          id="changeName"
          className="inline-flex items-center gap-2 rounded-md bg-blue-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
          type="button"
          onClick={() => {
            openDialog("login");
          }}
        >
          이름바꾸기
        </button>
      </div>
    </div>
  );
};

export default PrayerJournal;
