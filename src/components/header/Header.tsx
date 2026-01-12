import { CircleUser } from "lucide-react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import React from "react";
const Header = () => {
  const {user,signOut} = useAuthStore()

  const  handleSignOut = async () => {
    await signOut();
    toast.success("Đăng xuất thành công");
  }
  return (
    <header className="w-full h-[90px] bg-zinc-900 text-white">
      <div className="mx-auto max-w-7xl h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-2 w-[150px] h-[100px]">
          <img src="../src/assets/logo.png" alt="Logo" />
        </div>
        <Menubar className="border-none bg-transparent shadow-none ">
          <MenubarMenu>
            <MenubarTrigger className="mx-6 uppercase text-sm font-semibold text-white cursor-pointer ">
              Trang chủ
            </MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="mx-6 uppercase text-sm font-semibold text-white cursor-pointer">
              Dịch vụ
            </MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="mx-6 uppercase text-sm font-semibold text-white cursor-pointer">
              Thông tin
            </MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="mx-6 uppercase text-sm font-semibold text-white cursor-pointer">
              Tin tức
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <CircleUser size={28} />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-40 bg-zinc-800 text-white border-zinc-700">
            <DropdownMenuItem className="cursor-pointer">
              {user?.username}
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-zinc-700" />

            <DropdownMenuItem className="cursor-pointer text-red-400" onClick={handleSignOut}>
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
