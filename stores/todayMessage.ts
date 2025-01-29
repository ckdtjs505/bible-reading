import { create } from "zustand";

interface todayMessagesState {
  messages: string[];
  addMessage: (data: string) => void;
  removeMessage: (data: string) => void;
  clearMessages: () => void;
}
// 오늘 내게 주신 말씀
export const useTodayMessages = create<todayMessagesState>((set) => ({
  messages: [],
  addMessage: (newMessage: string) => {
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },
  removeMessage: (messageToRemove) => {
    set((state) => ({
      messages: state.messages.filter((msg) => msg !== messageToRemove),
    }));
  },
  clearMessages: () =>
    set({
      messages: [],
    }),
}));
