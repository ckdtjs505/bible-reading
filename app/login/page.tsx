import LoginForm from "@/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex flex-col justify-center  h-screen content-center items-center">
      <div id="title" className="text-center text-3xl mt-4 font-bold m-2">
        함 온 성
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
