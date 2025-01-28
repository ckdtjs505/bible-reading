"use client";
import { getUserProgressInfo } from "@/pages/api/userInfo";
import useUserInfo from "@/stores/userInfo";
import useStore from "@/stores/useStore";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const LoginForm: React.FC = () => {
  const userName = useStore(useUserInfo, (state) => state.userName) || "";
  const [inputName, setInputName] = useState<string>(userName);

  const router = useRouter();

  const { setUserName, setComplteDayCountList } = useUserInfo();
  useEffect(() => {
    setInputName(userName);
  }, [userName]);

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
        onClick={async () => {
          if (!inputName) {
            alert("이름을 입력해주세요!");
            return;
          }

          const info = await getUserProgressInfo(inputName);
          setComplteDayCountList(info.row);
          setUserName(inputName);
          router.push("/");
        }}
      >
        로그인
      </button>
    </div>
  );
};

export default LoginForm;
