import AppSidebar from "@/components/dashboard/appsidebar/AppSidebar";
import Navbar from "@/components/dashboard/navbar/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import AddVehicle from "./AddVehicle";
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
import { useVehicleTypeStore } from "@/store/useVehicleType";
import { useEffect, useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";
import EditVehicle from "./EditVehicle";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Vehicle = () => {
  const vehicles = useVehicleTypeStore((state) => state.vehicleTypes);
  const loading = useVehicleTypeStore((state) => state.loading);
  const fetchVehicleTypes = useVehicleTypeStore(
    (state) => state.fetchVehicleTypes
  );

  const [page, setPage] = useState(1);
  const limit = 10;

  const total = useVehicleTypeStore((state) => state.total);
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetchVehicleTypes(page, limit);
  }, [page]);

  const [editingVehicle, setEditingVehicle] = useState<any>(null);

  const deleteVehicle = useVehicleTypeStore((state) => state.deleteVehicleType);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={true}>
        <div className="h-screen w-full bg-muted/40 flex overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto overflow-y-auto p-6">
              <div className="flex justify-end items-end">
                <AddVehicle />
              </div>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>Mô tả</TableHead>
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
                          Không có loại xe
                        </TableCell>
                      </TableRow>
                    )}

                    {!loading &&
                      vehicles.map((vehicle) => (
                        <TableRow key={vehicle._id}>
                          <TableCell>{vehicle.vehicle_type_name}</TableCell>
                          <TableCell>{vehicle.description}</TableCell>
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
                                  onClick={() => setEditingVehicle(vehicle)}>
                                  Sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  className="text-red-500"
                                  onClick={() => deleteVehicle(vehicle._id)}>
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {vehicles.length > 0 && totalPages > 10 && (  
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
                )}
              </div>
                
            </main>
          </div>
        </div>
        <EditVehicle
          open={!!editingVehicle}
          setOpen={(open) => setEditingVehicle(open ? null : null)}
          vehicle={editingVehicle}
        />
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Vehicle;
