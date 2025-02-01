import { create } from "zustand";
import { persist } from "zustand/middleware";

type Messages = Record<string, { message: string; createAt: number }[]>;

interface ReceivedMessagesState {
  messages: Messages;
  addMessage: (date: string, message: string) => void;
  removeMessage: (date: string, message: string) => void;
  clearMessages: (date: string) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// 현재 시간 기준으로 30일 이내 데이터만 유지
const filterOldMessages = (messages: Messages) => {
  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

  return Object.keys(messages).reduce((acc, date) => {
    const filtered = messages[date].filter(
      (msg) => now - msg.createAt <= THIRTY_DAYS,
    );
    if (filtered.length > 0) {
      acc[date] = filtered;
    }
    return acc;
  }, {} as Messages);
};

export const useReceivedMessages = create<ReceivedMessagesState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => {
        set({
          _hasHydrated: state,
        });
      },
      messages: {},
      addMessage: (date, newMessage) => {
        console.log(newMessage)
        set((state) => {
          const currentMessage = state.messages[date] || [];
          const newMessages = {
            ...state.messages,
            [date]: [
              ...currentMessage,
              { message: newMessage, createAt: Date.now() },
            ],
          };

          const filteredMessages = filterOldMessages(newMessages);
          return { messages: filteredMessages };
        });
      },
      removeMessage: (date, messageToRemove) => {
        set((state) => {
          const updateMessages = (state.messages[date] || {}).filter(
            (msg) => msg.message !== messageToRemove,
          );

          const newMessage = {
            ...state.messages,
            [date]: updateMessages,
          };
          return { messages: newMessage };
        });
      },
      clearMessages: (date: string) =>
        set((state) => {
          const newMessages = {
            ...state.messages,
            [date]: [],
          };

          return { messages: newMessages };
        }),
    }),
    {
      name: "receivedMessage",
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    },
  ),
);
