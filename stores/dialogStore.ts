import { create } from "zustand";

type DialogType = "login" | null;

interface DialogState {
  isOpen: boolean;
  dialogType: DialogType;
  openDialog: (type: DialogType) => void;
  closeDialog: () => void;
}

const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  dialogType: null,
  openDialog: (type) => set({ isOpen: true, dialogType: type }),
  closeDialog: () => set({ isOpen: false, dialogType: null }),
}));

export default useDialogStore;
