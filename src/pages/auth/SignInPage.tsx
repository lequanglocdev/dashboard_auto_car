import { LoginForm } from "@/components/auth/login-form";
const SignInPage = () => {
  return (
    <div className="flex min-h-screen bg-[url('src/assets/bg-auth.png')] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;
