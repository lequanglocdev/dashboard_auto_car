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
import { Input } from "@/components/ui/input";
import { AddPriceLineDialog } from "./AddPriceLineDialog";
import { EditPriceHeader } from "./EditPriceHeader";
import { EditPriceLine } from "./EditPriceLine";
import { Switch } from "@/components/ui/switch";

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

  // Load header khi vào page
  useEffect(() => {
    fetchPriceHeaders();
  }, []);

  // Load line khi mở accordion
  const handleOpen = async (value: string) => {
    setActiveHeader(value);
    await fetchPriceLines(value);
  };

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
                <AddPriceHeader />
              </div>
              <div className="bg-destructive/40 p-4 grid grid-cols-5 rounded-md text-sm font-semibold">
                <div>TÊN BẢNG GIÁ</div>
                <div>NGÀY BẮT ĐẦU</div>
                <div>NGÀY KẾT THÚC</div>
                <div>TRẠNG THÁI</div>
                <div className="text-right">TÁC VỤ</div>
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

                        <div className="px-8">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              header.is_active
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}>
                            {header.is_active ? "Hoạt động" : "Không hoạt động"}
                          </span>
                        </div>

                        <div className="flex gap-3 justify-end">
                          <div onClick={(e) => e.stopPropagation()}>
                            <AddPriceLineDialog headerId={header._id} />
                          </div>

                          <button
                            onClick={() => setEditingPriceHeader(header)}
                            className="text-green-500">
                            Sửa
                          </button>
                          <button
                            onClick={() => deletePriceHeader(header._id)}
                            className="text-red-500">
                            Xóa
                          </button>
                        </div>
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
                                      onClick={(e) => e.stopPropagation()} // 🔥 quan trọng vì nằm trong AccordionTrigger
                                    >
                                      <Switch
                                        checked={line.is_active}
                                        onCheckedChange={() =>
                                          togglePriceLine(line._id)
                                        }
                                      />
                                    </div>
                                  </TableCell>

                                  <TableCell>
                                    <button
                                      onClick={() => setEditingPriceLine(line)}
                                      className="text-green-500 px-4">
                                      Sửa
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        console.log("Deleting:", line._id);
                                        e.stopPropagation();
                                        deletePriceLine(line._id);
                                      }}
                                      className="text-red-500">
                                      Xóa
                                    </button>
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
