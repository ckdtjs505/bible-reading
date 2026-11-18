"use client";

import { getUserProgressInfo, setReadBible } from "@/lib/google-api";
import { usePlans } from "@/stores/plan";
import { useReceivedMessages } from "@/stores/todayMessage";
import useUserInfo from "@/stores/userInfo";
import useStore from "@/stores/useStore";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useDialogStore from "@/stores/dialogStore";

import { bookKeyNumber } from "@/constants/bibleNumber";

type SaveStatus = "idle" | "saving" | "done" | "copyFailed" | "saveFailed" | "noName";

// 카카오톡 인앱 브라우저 등 Clipboard API가 막힌 곳을 위해 execCommand로 한 번 더 시도한다
const copyText = async (text: string) => {
  try {
    // 권한 창 등으로 writeText가 끝나지 않으면 "기록하는 중"에 갇히므로 2초에서 끊는다
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise((_, reject) => setTimeout(() => reject(new Error("copy timeout")), 2000)),
    ]);
    return;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    if (!ok) throw new Error("copy failed");
  }
};

const PrayerJournal = () => {
  const { currentPlan } = usePlans();
  const { messages } = useReceivedMessages();
  const { openDialog } = useDialogStore();

  const userName = useStore(useUserInfo, (state) => state.userName);
  const hasHydrated = useStore(useUserInfo, (state) => state._hasHydrated);
  const { addCompletedIndexList, setCompletedIndexList } = useUserInfo();
  const [isShowPlayForUserCheckBox, setIsShowPlayForUserCheckBox] =
    useState(false);

  const router = useRouter();
  const [isShowPray, setIsShowPray] = useState(false);
  const [prayForUser, setPrayForUser] = useState("");
  const [pray, setPray] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastCopyData, setLastCopyData] = useState("");

  // 다른 날을 보거나 이름을 바꾸면 이전 기록 결과 안내는 지운다
  useEffect(() => {
    setSaveStatus("idle");
  }, [currentPlan?.index, userName]);

  const formatDay = (daycount: number): number => {
    return daycount;
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
    if (hasHydrated) {
      if (userName === "") {
        openDialog("login");
      } else {
        const fetchData = async () => {
          try {
            const info = await getUserProgressInfo(userName || "");
            setCompletedIndexList((info.row || []).map(String));
          } catch (err) {
            console.log(err);
          }
        };

        fetchData();
      }
    }
  }, [userName, router, hasHydrated, openDialog, setCompletedIndexList]);

  const currentMessages = currentPlan ? (messages[currentPlan.date] || []) : [];

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


  const handleSaveButton = async () => {
    if (!currentPlan || saveStatus === "saving") return;
    if (!userName) {
      setSaveStatus("noName");
      openDialog("login");
      return;
    }
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

    setLastCopyData(copyData);
    setSaveStatus("saving");

    // 복사는 사용자 클릭 직후에 시작해야 브라우저가 허용하므로 기록 요청보다 먼저 시작한다
    const copying = copyText(copyData);
    // 구절을 담지 않아도 읽음은 기록한다 (no-cors라 네트워크 실패만 알 수 있다)
    const saving = setReadBible({
      name: userName,
      pray: pray,
      myMessage: myMessage,
      prayForUser: prayForUser,
      daycnt: Number(currentPlan.daycount),
      index: currentPlan.index,
    });

    const [copied, saved] = await Promise.allSettled([copying, saving]);

    if (saved.status === "rejected") {
      setSaveStatus("saveFailed");
      return;
    }
    addCompletedIndexList(currentPlan.index);
    setSaveStatus(copied.status === "fulfilled" ? "done" : "copyFailed");
  };

  const handleRetryCopy = async () => {
    try {
      await copyText(lastCopyData);
      setSaveStatus("done");
    } catch {
      setSaveStatus("copyFailed");
    }
  };

  const day = formatDay(Number(currentPlan?.daycount || 0));
  const statusMessage: Record<Exclude<SaveStatus, "idle">, string> = {
    saving: "기록하는 중이에요…",
    done: `✓ 제 ${day}일차 기록 완료! 복사된 글을 카톡 단톡방에 붙여넣어 주세요.`,
    copyFailed: `✓ 제 ${day}일차 기록은 완료됐어요. 글 복사가 안 돼서, 아래 '다시 복사하기'를 눌러 주세요.`,
    saveFailed: "기록이 되지 않았어요. 인터넷 연결을 확인하고 '기록하고 복사하기'를 다시 눌러 주세요.",
    noName: "이름을 먼저 입력해 주세요.",
  };
  const isError = saveStatus === "saveFailed" || saveStatus === "noName";

  return (
    <div className="border-t border-gray-200">
      <section className="px-4 py-5" aria-labelledby="journalSettingTitle">
        <h2 id="journalSettingTitle" className="text-lg font-bold">
          함온성 설정
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          체크하면 아래에 입력칸이 생기고, 복사하는 글에도 들어가요.
        </p>
        <div className="mt-2">
          <label
            htmlFor="prayForUserCheckBox"
            className="flex min-h-11 cursor-pointer items-center gap-3 text-base"
          >
            <input
              type="checkbox"
              className="size-6 accent-blue-600"
              id="prayForUserCheckBox"
              checked={isShowPlayForUserCheckBox}
              onChange={() =>
                setIsShowPlayForUserCheckBox((isShow: boolean) => {
                  setLocalStorage("isShowPlayForUserCheckBox", !isShow);

                  return !isShow;
                })
              }
            />
            💝 앞사람을 위한 기도
          </label>
          <label
            htmlFor="prayCheckBox"
            className="flex min-h-11 cursor-pointer items-center gap-3 text-base"
          >
            <input
              type="checkbox"
              className="size-6 accent-blue-600"
              id="prayCheckBox"
              checked={isShowPray}
              onChange={() =>
                setIsShowPray((isShow: boolean) => {
                  setLocalStorage("isShowPray", !isShow);
                  return !isShow;
                })
              }
            />
            🙏 한줄 기도하기
          </label>
        </div>
      </section>

      {currentPlan && (
        <div id="userContent" className="border-t border-gray-200 px-4 py-5">
          <div id="submitdata" className="space-y-5 text-base">
            {isShowPlayForUserCheckBox && (
              <div id="prayForUser">
                <label htmlFor="prayForUserText" className="block font-semibold">
                  💝 앞사람을 위한 기도
                </label>
                <textarea
                  value={prayForUser}
                  id="prayForUserText"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setPrayForUser(e.target.value)
                  }
                  className="mt-2 block h-24 w-full rounded-md border border-gray-300 p-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                ></textarea>
              </div>
            )}

            <div>
              <div className="font-semibold">🌸 이름</div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3">
                <span id="name" className="text-lg">
                  {userName}
                </span>
                <button
                  id="changeName"
                  type="button"
                  onClick={() => openDialog("login")}
                  className="min-h-11 px-1 text-sm text-gray-600 underline underline-offset-4 hover:text-gray-900"
                >
                  이름 바꾸기
                </button>
              </div>
            </div>

            <div>
              <div className="font-semibold">📖 오늘 내게 주신 말씀</div>
              <div
                id="myMessage"
                className="mt-2 rounded-md bg-gray-50 p-3 leading-relaxed"
              >
                {sortedMessageEntries.length === 0 && (
                  <div className="text-sm text-gray-600">
                    (선택) 본문에서 마음에 닿은 구절을 누르면 여기에 담겨요.
                  </div>
                )}
                {sortedMessageEntries.map(([book, msgs], index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="font-bold">{book}</div>
                    {msgs.map(({ chapter, verse, content }, vIndex) => (
                      <div key={vIndex} className="mt-1">
                        <span className="text-gray-600">
                          {chapter}:{verse}
                        </span>{" "}
                        {content}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {isShowPray && (
              <div id="prayBox">
                <label htmlFor="pray" className="block font-semibold">
                  🙏 한줄 기도
                </label>
                <textarea
                  value={pray}
                  id="pray"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setPray(e.target.value)
                  }
                  className="mt-2 block h-24 w-full rounded-md border border-gray-300 p-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                ></textarea>
              </div>
            )}

            <p className="text-lg font-bold">
              제 <span id="day">{formatDay(Number(currentPlan?.daycount || 0))}</span>일차 완료했습니다.
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <button
              id="saveButton"
              className="min-h-14 w-full rounded-md bg-blue-600 px-4 text-lg font-bold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-70"
              type="button"
              onClick={handleSaveButton}
              disabled={saveStatus === "saving"}
              aria-busy={saveStatus === "saving"}
            >
              {saveStatus === "saving" ? "기록하는 중…" : "기록하고 복사하기"}
            </button>
            <button
              id="openMyWords"
              className="min-h-11 w-full rounded-md border border-blue-600 bg-white px-4 text-base font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              type="button"
              onClick={() => {
                openDialog("myWords");
              }}
            >
              📜 말씀 모아보기
            </button>
          </div>
          <div role="status" aria-live="polite">
            {saveStatus !== "idle" && (
              <div
                className={`mt-3 rounded-md p-4 text-base font-semibold ${
                  isError ? "bg-red-50 text-red-700" : "bg-[#cbf1f5] text-[#171717]"
                }`}
              >
                {statusMessage[saveStatus]}
                {saveStatus === "copyFailed" && (
                  <button
                    type="button"
                    onClick={handleRetryCopy}
                    className="mt-3 block min-h-11 w-full rounded-md bg-white px-4 text-base font-semibold text-[#171717] ring-1 ring-gray-300"
                  >
                    다시 복사하기
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerJournal;
