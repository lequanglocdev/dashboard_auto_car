import AppSidebar from "@/components/dashboard/appsidebar/AppSidebar";
import Navbar from "@/components/dashboard/navbar/Navbar";
import { Input } from "@/components/ui/input";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { AddCustomer } from "./AddCustomer";
import { useCustomerStore } from "@/store/useCustomerStore";
import React, { useEffect } from "react";
import { EditCustomer } from "./EditCustomer";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Customer = () => {
  const customers = useCustomerStore((state) => state.customers);
  const loading = useCustomerStore((state) => state.loading);
  const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);

  const [page, setPage] = React.useState(1);
  const limit = 10;

  const total = useCustomerStore((state) => state.total);
  const totalPages = Math.ceil(total / limit);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers(page, limit);
  }, [page]);

  const [editingCustomer, setEditingCustomer] = React.useState<any>(null);

  const deleteCustomer = useCustomerStore((state) => state.deleteCustomer);

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
                    placeholder="Tìm kiếm khách hàng"
                  />
                </div>
                <AddCustomer />
              </div>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                      <TableHead>Địa chỉ</TableHead>
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

                    {!loading && customers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          Không có khách hàng
                        </TableCell>
                      </TableRow>
                    )}

                    {!loading &&
                      customers.map((customer) => (
                        <TableRow
                          key={customer._id}
                          onClick={() => navigate(`/customer/${customer._id}`)}>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.phone_number}</TableCell>
                          <TableCell>{customer.address}</TableCell>
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
                                  onClick={() => setEditingCustomer(customer)}>
                                  Sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  className="text-red-500"
                                  onClick={() => deleteCustomer(customer._id)}>
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
        <EditCustomer
          open={!!editingCustomer}
          setOpen={() => setEditingCustomer(null)}
          customer={editingCustomer}
        />
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Customer;
