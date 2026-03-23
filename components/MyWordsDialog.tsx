"use client";
import useStore from "@/stores/useStore";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Button
} from "@headlessui/react";
import useDialogStore from "@/stores/dialogStore";
import useUserInfo from "@/stores/userInfo";
import { useQuery } from "@tanstack/react-query";

interface FetchedWord {
  daycnt: string;
  Timestamp: string;
  myMessage: string;
}

const MyWordsDialog: React.FC = () => {
  const { isOpen, dialogType, closeDialog } = useDialogStore();
  const isMyWordsOpen = isOpen && dialogType === "myWords";
  const userName = useStore(useUserInfo, (state) => state.userName) || "";

  const { data: words = [], isLoading, error } = useQuery({
    queryKey: ["myWords", userName],
    queryFn: async () => {
      const res = await fetch(`/api/mywords?userName=${encodeURIComponent(userName)}`);
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "데이터를 불러오는 데 실패했습니다.");
      }
      return json.data as FetchedWord[];
    },
    // 다이얼로그가 열려있고 사용자 이름이 있을 때만 API 호출 (자동 최적화)
    enabled: isMyWordsOpen && !!userName,
    staleTime: 5 * 60 * 1000, // 5분 동안은 캐시된 데이터(기존 데이터)를 사용하여 재요청 방지
    gcTime: 10 * 60 * 1000, // 10분 동안 사용안하면 메모리에서 지움
  });

  const close = () => {
    closeDialog();
  };

  return (
    <Dialog
      open={isMyWordsOpen}
      as="div"
      onClose={close}
      className="relative z-50 focus:outline-none"
    >
      <div className="bg-black bg-opacity-50 fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="border bg-white w-full max-w-md rounded-xl p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 max-h-[80vh] overflow-y-auto shadow-2xl flex flex-col"
          >
            <DialogTitle className="text-xl font-bold mb-6 text-center text-gray-800">
              📜 내게 주신 말씀 모아보기
            </DialogTitle>
            
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
              <div className="flex flex-col gap-6">
                {!userName ? (
                   <div className="text-center text-gray-500 py-8">이름을 먼저 입력해주세요!</div>
                ) : isLoading ? (
                  <div className="text-center text-gray-500 py-8 flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    말씀을 불러오는 중...
                  </div>
                ) : error ? (
                   <div className="text-center text-red-500 py-8">{(error as Error).message}</div>
                ) : words.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">아직 담아둔 말씀이 없습니다.<br/>말씀을 클릭하여 담아보세요!</div>
                ) : (
                  words.map((word, idx) => (
                    <div key={idx} className="border-b pb-4 border-gray-200 last:border-0 last:pb-0">
                      <div className="font-semibold text-blue-600 mb-3">{word.daycnt}일차</div>
                      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <div className="text-gray-800 leading-relaxed text-sm whitespace-pre-wrap">
                          {word.myMessage}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2 text-right">
                        {new Date(word.Timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center sticky bottom-0 bg-white">
              <Button
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 px-6 text-sm font-semibold text-gray-800 hover:bg-gray-200 focus:outline-none transition-colors"
                onClick={close}
              >
                닫기
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default MyWordsDialog;
