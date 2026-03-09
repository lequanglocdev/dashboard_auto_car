import React, { useEffect, useState } from "react";
import AppSidebar from "@/components/dashboard/appsidebar/AppSidebar";
import Navbar from "@/components/dashboard/navbar/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { usePriceStore } from "@/store/usePriceStore";
import { AddPriceHeader } from "./AddPriceHeader";
import { AddPriceLineDialog } from "./AddPriceLineDialog";
import { EditPriceHeader } from "./EditPriceHeader";
import { EditPriceLine } from "./EditPriceLine";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";

const Price = () => {
  const {
    priceHeaders,
    priceLines,
    fetchPriceHeaders,
    fetchPriceLines,
    loading,
  } = usePriceStore();

  const [activeHeader, setActiveHeader] = useState<string | null>(null);

  const [editingPriceHeader, setEditingPriceHeader] = React.useState<any>(null);

  const [editingPriceLine, setEditingPriceLine] = React.useState<any>(null);

  const deletePriceHeader = usePriceStore((state) => state.deletePriceHeader);

  const deletePriceLine = usePriceStore((state) => state.deletePriceLine);

  const togglePriceLine = usePriceStore((state) => state.togglePriceLine);

  const togglePriceHead = usePriceStore((state) => state.togglePriceHead);

  const handleOpen = async (value: string) => {
    setActiveHeader(value);
    await fetchPriceLines(value);
  };

  useEffect(() => {
    fetchPriceHeaders();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={true}>
        <div className="h-screen w-full bg-muted/40 flex overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto overflow-y-auto p-6">
              <div className="flex items-center justify-end mb-8">
                <AddPriceHeader />
              </div>
              <div className="bg-destructive/40 p-4 grid grid-cols-5 rounded-md text-sm font-semibold">
                <span>Tên bảng giá</span>
                <span>Ngày bắt đầu</span>
                <span>Ngày kết thúc</span>
                <span>Trạng thái</span>
                <span className="text-right">Tác vụ</span>
              </div>
              <Accordion
                type="single"
                collapsible
                className="w-full"
                onValueChange={(value) => {
                  if (value) handleOpen(value);
                }}>
                {priceHeaders.map((header) => (
                  <AccordionItem key={header._id} value={header._id}>
                    <AccordionTrigger className="py-3rounded-md hover:no-underline">
                      <div className="grid grid-cols-5 w-full items-center text-sm font-medium">
                        <div>{header.price_list_name}</div>

                        <div className="px-4">
                          {new Date(header.start_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>

                        <div className="px-6">
                          {new Date(header.end_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>

                        <div className="px-8 flex items-center">
                          <Switch
                            checked={header.is_active}
                            onCheckedChange={() => togglePriceHead(header._id)}
                          />
                        </div>
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
                              <div>
                                <AddPriceLineDialog headerId={header._id} />
                              </div>
                              <DropdownMenuItem
                                onClick={() => setEditingPriceHeader(header)}>
                                Sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => deletePriceHeader(header._id)}
                                variant="destructive"
                                className="text-red-500">
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {loading ? (
                        <p>Loading...</p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tên dịch vụ</TableHead>
                              <TableHead>Loại xe</TableHead>
                              <TableHead>Giá</TableHead>
                              <TableHead>Trạng thái</TableHead>
                              <TableHead>Tác vụ</TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {activeHeader === header._id &&
                            priceLines.length > 0 ? (
                              priceLines.map((line) => (
                                <TableRow key={line._id}>
                                  <TableCell>{line.service_id?.name}</TableCell>
                                  <TableCell>
                                    {line.vehicle_type_id?.vehicle_type_name}
                                  </TableCell>
                                  <TableCell>
                                    {line.price.toLocaleString()} đ
                                  </TableCell>
                                  <TableCell>
                                    <div
                                      className="px-8 flex items-center"
                                      onClick={(e) => e.stopPropagation()}>
                                      <Switch
                                        checked={line.is_active}
                                        onCheckedChange={() =>
                                          togglePriceLine(line._id)
                                        }
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell>
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
                                            setEditingPriceLine(line)
                                          }>
                                          Sửa
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          variant="destructive"
                                          className="text-red-500"
                                          onClick={(e) => {
                                            console.log("Deleting:", line._id);
                                            e.stopPropagation();
                                            deletePriceLine(line._id);
                                          }}>
                                          Xóa
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                  Không có dữ liệu
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </main>
          </div>
        </div>
        <EditPriceHeader
          open={!!editingPriceHeader}
          setOpen={() => setEditingPriceHeader(null)}
          priceHeader={editingPriceHeader}
        />
        <EditPriceLine
          open={!!editingPriceLine}
          setOpen={() => setEditingPriceLine(null)}
          priceLine={editingPriceLine}
        />
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Price;
