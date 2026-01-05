import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import React from "react";
import { Eye, EyeOff } from "lucide-react";


const logInScchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  email: z.string().min(3, "Email phải có ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormValues = z.infer<typeof logInScchema>;

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(logInScchema) });
  const { signUp } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  

  const onSubmit = async (data: LoginFormValues) => {
    const { username,email, password } = data;
    await signUp(username,email, password);
    navigate("/signin");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 bg-background">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col justify-center items-center gap-6">
              <div className="flex flex-col gap-2"></div>
              <h2 className="text-xl font-bold leading-tight mb-4">Đăng ký</h2>
            </div>
            <div className="flex flex-col gap-3 ">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <input
                type="text"
                id="username"
                placeholder="nhap ten dang nhap"
                className="w-full rounded-md border border-input bg-background px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("username")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <Label htmlFor="email">Email</Label>
              <input
                type="email"
                id="email"
                placeholder="nhap email"
                className="w-full rounded-md border 
                 border-input bg-background px-3 py-3 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <Label htmlFor="password">Mật khẩu</Label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="nhập mật khẩu"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10
        placeholder:text-muted-foreground focus:outline-none focus:ring-2
        focus:ring-ring focus:ring-offset-2"
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="mt-6 w-full cursor-pointer"
              disabled={isSubmitting}>
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
            <div className="text-sm text-muted-foreground mt-4 text-center">
              Đã có tài khoản?
              <a href="/signin" className="text-primary hover:underline ml-1">
                Đăng nhập
              </a>
            </div>
          </form>
          <div className="relative hidden h-full md:block">
            <img
              src="../src/assets/logo.png"
              alt=""
              className="absolute top-1/2 -translate-y-1/2 object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
