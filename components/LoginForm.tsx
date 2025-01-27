"use client";
import useUserInfo from "@/stores/userInfo";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const LoginForm: React.FC = () => {
  const { userName, updateUserInfo } = useUserInfo();
  const [inputName, setInputName] = useState<string>(userName);

  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputName(e.target.value);
  };
  return (
    <div>
      <div>
        이름
        <input
          className="border"
          onChange={handleInputChange}
          value={inputName}
        />
      </div>
      <button
        onClick={() => {
          setLocalStorage("userName", userName);
          updateUserInfo({ userName: inputName });
          router.push("/");
        }}
      >
        로그인
      </button>
    </div>
  );
};

export default LoginForm;
