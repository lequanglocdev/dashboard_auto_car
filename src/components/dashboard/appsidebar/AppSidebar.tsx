import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Calendar,
  ChevronDown,
  Home,
  Projector,
  Settings,
  User,
  Car,
  Toolbox,
  ClipboardList,
  TicketPercent,
  Receipt
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const items = [
  {
    title: "Tổng quan",
    url: "/admin",
    icon: Home,
  },

  {
    title: "Quản lý khách hàng",
    url: "/customer",
    icon: User,
  },
  {
    title: "Quản lý loại xe",
    url: "#",
    icon: Car,
  },
  {
    title: "Quản lý dịch vụ",
    url: "#",
    icon: Toolbox,
  },
  {
    title: "Quản lý bảng giá",
    url: "#",
    icon: ClipboardList,
  },
  {
    title: "Quản lý chương trình khuyến mãi",
    url: "#",
    icon: TicketPercent,
  },
  {
    title: "Quản lý hóa đơn",
    url: "#",
    icon: Receipt,
  },
];

const AppSidebar = () => {
  const {user} = useAuthStore()
  const navigate = useNavigate()
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <span>{user?.username}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => navigate(item.url)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <h4>{item.title}</h4>
                  </SidebarMenuButton>
                  {item.title === "Inbox" && (
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Collapsible className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Thống kê</span>
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>

            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Projector className="mr-2 h-4 w-4" />
                      Doanh thu
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Calendar className="mr-2 h-4 w-4" />
                      Theo tháng
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
