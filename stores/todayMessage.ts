import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 오늘 내게 주신 말씀.
 */
export interface TodayMessage {
  book: string;
  chapter: number;
  verse: number;
  content: string; // The text content of the verse
  createAt: number;
}

type Messages = Record<string, TodayMessage[]>;

interface ReceivedMessagesState {
  messages: Messages;
  addMessage: (date: string, verse: Omit<TodayMessage, "createAt">) => void;
  removeMessage: (
    date: string,
    verse: Omit<TodayMessage, "createAt" | "content">,
  ) => void;
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
      addMessage: (date, newVerse) => {
        set((state) => {
          const currentMessage = state.messages[date] || [];

          // Check for duplicates based on ID (book, chapter, verse)
          const exists = currentMessage.some(
            (m) =>
              m.book === newVerse.book &&
              m.chapter === newVerse.chapter &&
              m.verse === newVerse.verse,
          );

          if (exists) {
            return { messages: state.messages };
          }

          const newMessages = {
            ...state.messages,
            [date]: [
              ...currentMessage,
              { ...newVerse, createAt: Date.now() },
            ],
          };

          const filteredMessages = filterOldMessages(newMessages);
          return { messages: filteredMessages };
        });
      },
      removeMessage: (date, verseToRemove) => {
        set((state) => {
          const updateMessages = (state.messages[date] || []).filter(
            (msg) =>
              !(
                msg.book === verseToRemove.book &&
                msg.chapter === verseToRemove.chapter &&
                msg.verse === verseToRemove.verse
              ),
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
      name: "receivedMessage-v2", // Versioned to avoid conflicts with old string-based data
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    },
  ),
);
