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

import { usePromotionStore } from "@/store/usePromotionStore";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AddPromotionHeader } from "./AddPromotionHeader";
import AddPromotionLineDialog from "./AddPromotionLineDialog";

const Promotion = () => {
  const {
    promotionHeaders,
    promotionLines,
    fetchPromotionHeaders,
    fetchPromotionLines,
    loading,
  } = usePromotionStore();

  const [activeHeader, setActiveHeader] = useState<string | null>(null);
  // const [editingHeader, setEditingHeader] = useState<any>(null);
  // const [editingLine, setEditingLine] = useState<any>(null);

  const deletePromotionHeader = usePromotionStore(
    (state) => state.deletePromotionHeader
  );
  const deletePromotionLine = usePromotionStore(
    (state) => state.deletePromotionLine
  );
  // const togglePromotionLine = usePromotionStore(
  //   (state) => state.togglePromotionLine
  // );

  useEffect(() => {
    fetchPromotionHeaders();
  }, []);

  const handleOpen = async (value: string) => {
    setActiveHeader(value);
    await fetchPromotionLines(value);
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
                    placeholder="Tìm kiếm chương trình"
                  />
                </div>
                <AddPromotionHeader />
              </div>

              <div className="bg-destructive/40 p-4 grid grid-cols-7 rounded-md text-sm font-semibold">
                <h4>MÃ KHUYẾN MÃI</h4>
                <h4>TÊN KHUYẾN MÃI</h4>
                <h4>MÔ TẢ</h4>
                <h4>NGÀY BẮT ĐẦU</h4>
                <h4>NGÀY KẾT THÚC</h4>
                <h4>TRẠNG THÁI</h4>
                <h4 className="text-right">TÁC VỤ</h4>
              </div>

              <Accordion
                type="single"
                collapsible
                className="w-full"
                onValueChange={(value) => {
                  if (value) handleOpen(value);
                }}>
                {promotionHeaders.map((header) => (
                  <AccordionItem key={header._id} value={header._id}>
                    <AccordionTrigger className="py-3 hover:no-underline">
                      <div className="grid grid-cols-7 w-full items-center text-sm font-medium">
                        <div>{header.promotion_code}</div>
                        <div>{header.name}</div>
                        <div>{header.description}</div>
                        <div className="">
                          {new Date(header.start_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>

                        <div className="">
                          {new Date(header.end_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>

                        <div className="">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              header.is_active
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}>
                            {header.is_active ? "Hoạt động" : "Không hoạt động"}
                          </span>
                        </div>

                        <div className="flex justify-end gap-3 ">
                          <div onClick={(e) => e.stopPropagation()}>
                            <AddPromotionLineDialog  />
                          </div>

                          <button className="text-green-500">Sửa</button>
                          <button
                            onClick={() => deletePromotionHeader(header._id)}
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
                              <TableHead>Loại giảm giá </TableHead>
                              <TableHead>Mô tả dòng khuyến mãi</TableHead>
                              <TableHead>Trạng thái</TableHead>
                              <TableHead>Tác vụ</TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {activeHeader === header._id &&
                            promotionLines.length > 0 ? (
                              promotionLines.map((line) => (
                                <TableRow key={line._id}>
                                  {/* <TableCell>{line.service_id.name}</TableCell> */}

                                  {/* <TableCell>
                                    {line.vehicle_type_id?.vehicle_type_name}
                                  </TableCell>

                                  <TableCell>
                                    {line.type === "percent"
                                      ? "Phần trăm"
                                      : "Giảm giá cố định"}
                                  </TableCell>

                                  <TableCell>
                                    {line.type === "percent"
                                      ? `${line.value}%`
                                      : `${line.value.toLocaleString()} đ`}
                                  </TableCell> */}

                                  <TableCell>
                                    <div
                                      className="px-4"
                                      onClick={(e) => e.stopPropagation()}>
                                      <Switch checked={line.is_active} />
                                    </div>
                                  </TableCell>

                                  <TableCell>
                                    <button className="text-green-500 px-4">
                                      Sửa
                                    </button>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deletePromotionLine(line._id);
                                      }}
                                      className="text-red-500">
                                      Xóa
                                    </button>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center">
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
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Promotion;
