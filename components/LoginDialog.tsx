"use client";
import useUserInfo from "@/stores/userInfo";
import useStore from "@/stores/useStore";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Button,
  DialogTitle,
  Input,
} from "@headlessui/react";
import useDialogStore from "@/stores/dialogStore";

const LoginDialog: React.FC = () => {
  const { isOpen, dialogType, closeDialog } = useDialogStore();
  const isLoginOpen = isOpen && dialogType === "login";
  const userName = useStore(useUserInfo, (state) => state.userName) || "";
  const [inputName, setInputName] = useState<string>(userName);

  const { setUserName } = useUserInfo();
  useEffect(() => {
    setInputName(userName);
  }, [userName]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value);
  };

  const close = () => {
    closeDialog();
  };

  const enter = () => {
    if (!inputName) {
      alert("이름을 입력해주세요!");
      return;
    }

    closeDialog();
    setUserName(inputName);
  };
  return (
    <div>
      <Dialog
        open={isLoginOpen}
        as="div"
        onClose={close}
        className="relative z-10 focus:outline-none"
      >
        <div className="bg-black bg-opacity-50 fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2">
            <DialogPanel
              transition
              className="border bg-white w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl uration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle className="text-2xl font-bold m-3 text-center">
                함 온 성
                <div className="text-lg font-mono">
                  함께하는 온라인 성경일독
                </div>
              </DialogTitle>
              <div className="text-center">
                <Input
                  placeholder="이름을 입력해주세요 "
                  className="border h-10 rounded-md"
                  onChange={handleInputChange}
                  value={inputName}
                />
              </div>

              <div className="mt-4 text-center">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-blue-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={enter}
                >
                  입력하기
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default LoginDialog;
