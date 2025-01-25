import { create } from "zustand";

interface todayMessage {
  message: string[];
  add: (data: string) => void;
  remove: (data: string) => void;
}

export const useTodayMessage = create<todayMessage>((set) => ({
  message: [],
  add: (newMessage: string) => {
    set((state) => ({ message: [...state.message, newMessage] }));
  },
  remove: (messageToRemove) => {
    set((state) => ({
      message: state.message.filter((msg) => msg !== messageToRemove),
    }));
  },
}));
