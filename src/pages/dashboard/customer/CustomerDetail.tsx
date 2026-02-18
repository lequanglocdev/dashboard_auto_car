import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomerStore } from "@/store/useCustomerStore";
import type Customer from "@/types/customer";

import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/dashboard/navbar/Navbar";
import AppSidebar from "@/components/dashboard/appsidebar/AppSidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddVehicleCustomer from "./AddVehicleCustomer";
import { ArrowLeft, MoreHorizontalIcon } from "lucide-react";
import { useVehicleByCustomerStore } from "@/store/useVehicleByCustomer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditVehicleCustomer from "./EditVehicleCustomer";

const CustomerDetail = () => {
  const { id } = useParams();
  const getCustomerById = useCustomerStore((state) => state.getCustomerById);
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const vehicles = useVehicleByCustomerStore((state) => state.vehicle);
  const setVehicles = useVehicleByCustomerStore((state) => state.setVehicles);

  const [loading, setLoading] = useState(true);

  const [editingVehicleByCustomer, setEditingVehicleByCustomer ] = useState<any>(null);
  
  const deleteVehicleByCustomerId = useVehicleByCustomerStore(
    (state) => state.deleteVehicleByCustomerId
  );

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      const data = await getCustomerById(id);
      setCustomer(data.customer);
      setVehicles(data.vehicles);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (!customer) return <div className="p-6">Đang tải...</div>;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={true}>
        <div className="h-screen w-full bg-muted/40 flex overflow-hidden">
          <AppSidebar />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto overflow-y-auto p-6 space-y-6">
              <div>
                <ArrowLeft
                  onClick={() => navigate("/customer")}
                  className="cursor-pointer"
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin khách hàng</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Họ tên</p>
                    <p className="font-medium">{customer.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Số điện thoại
                    </p>
                    <p className="font-medium">{customer.phone_number}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Địa chỉ</p>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* ===== DANH SÁCH XE ===== */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Xe của khách hàng</CardTitle>

                  <AddVehicleCustomer customerId={id!} />
                </CardHeader>

                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Biển số</TableHead>
                        <TableHead>Loại xe</TableHead>
                        <TableHead>Hãng xe</TableHead>
                        <TableHead>Màu xe</TableHead>
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

                      {!loading && vehicles.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            Khách hàng chưa có xe
                          </TableCell>
                        </TableRow>
                      )}

                      {!loading &&
                        vehicles.map((vehicle) => (
                          <TableRow key={vehicle._id}>
                            <TableCell>{vehicle.license_plate}</TableCell>
                            <TableCell>
                              {vehicle.vehicle_type_id?.vehicle_type_name}
                            </TableCell>
                            <TableCell>{vehicle.manufacturer}</TableCell>
                            <TableCell>{vehicle.color}</TableCell>

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
                                    onClick={() =>
                                      setEditingVehicleByCustomer(vehicle)
                                    }>
                                    Sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    variant="destructive"
                                    className="text-red-500"
                                    onClick={() =>
                                      deleteVehicleByCustomerId(customer._id, vehicle._id)
                                    }>
                                    Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
        <EditVehicleCustomer
          open={!!editingVehicleByCustomer}
          setOpen={(open) => {
            if (!open) setEditingVehicleByCustomer(null);
          }}
          vehicle={editingVehicleByCustomer}
        />
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default CustomerDetail;
