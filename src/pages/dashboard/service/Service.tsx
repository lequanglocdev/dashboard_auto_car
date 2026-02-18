import AppSidebar from "@/components/dashboard/appsidebar/AppSidebar";
import Navbar from "@/components/dashboard/navbar/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useServicesStore } from "@/store/useServices";
import { useEffect, useState } from "react";
import AddService from "./AddService";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import EditService from "./EditService";
const Service = () => {
  const services = useServicesStore((state) => state.services);
  const loading = useServicesStore((state) => state.loading);
  const fetchServices = useServicesStore((state) => state.fetchServices);

  const [page, setPage] = useState(1);
  const limit = 10;
  const total = useServicesStore((state) => state.total);
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetchServices(page, limit);
  }, [page]);

  const [editingService, setEditingService] = useState<any>(null);

  const deleteService = useServicesStore((state) => state.deleteService);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={true}>
        <div className="h-screen w-full bg-muted/40 flex overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <span className="mr-4">Tìm kiếm</span>
                  <Input
                    className="w-[400px]"
                    placeholder="Tìm kiếm dịch vụ"
                  />
                </div>
                <AddService />
              </div>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã dịch vụ</TableHead>
                      <TableHead>Tên dịch vụ </TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead className="text-right">Tác vụ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          Đang tải dữ liệu...
                        </TableCell>
                      </TableRow>
                    )}

                    {!loading && services.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          Không có dịch vụ
                        </TableCell>
                      </TableRow>
                    )}

                    {!loading &&
                      services.map((service) => (
                        <TableRow key={service._id}>
                          <TableCell>{service.service_code}</TableCell>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>{service.description}</TableCell>
                          <TableCell>{service.time_required}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8">
                                  <MoreHorizontalIcon />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setEditingService(service)}>
                                  Sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  className="text-red-500"
                                  onClick={() => deleteService(service._id)}>
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => page > 1 && setPage(page - 1)}
                        />
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink isActive>{page}</PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => page < totalPages && setPage(page + 1)}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </main>
          </div>
        </div>
        <EditService
          open={!!editingService}
          setOpen={() => setEditingService(null)}
          service={editingService}
        />
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default Service
