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
import { EditPromotionHeaderDialog } from "./EditPromotionHeaderDialog";
import { EditPromotionLineDialog } from "./EditPromotionLineDialog";
import AddPromotionDetailDialog from "./AddPromotionDetail";

const Promotion = () => {
  const {
    promotionHeaders,
    promotionLines,
    fetchPromotionHeaders,
    fetchPromotionLines,
    loading,
    promotionDetails,
    fetchPromotionDetails,
  } = usePromotionStore();

  console.log(">>promotionheader", promotionHeaders);
  const [activeHeader, setActiveHeader] = useState<string | null>(null);
  const [activeLine, setActiveLine] = useState<string | null>(null);

  const [editingHeader, setEditingHeader] = useState<any>(null);
  const [editingLine, setEditingLine] = useState<any>(null);

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

  const handleOpenLine = async (lineId: string) => {
    setActiveLine(lineId);
    await fetchPromotionDetails(lineId);
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
                        <span className="ml-4">{header.promotion_code}</span>
                        <span className="ml-4">{header.name}</span>
                        <span className="whitespace-normal break-words max-w-[80px]">
                          {header.description}
                        </span>
                        <span className="">
                          {new Date(header.start_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>

                        <span className="">
                          {new Date(header.end_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>

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
                            <AddPromotionLineDialog headerId={header._id} />
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingHeader(header);
                            }}
                            className="text-green-500">
                            Sửa
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePromotionHeader(header._id);
                            }}
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
                              <TableHead>Mô tả dòng</TableHead>
                              <TableHead></TableHead>
                              <TableHead>Trạng thái</TableHead>
                              <TableHead>Tác vụ</TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {activeHeader === header._id &&
                            promotionLines.length > 0 ? (
                              promotionLines.map((line) => (
                                <React.Fragment key={line._id}>
                                  <TableRow
                                    className="cursor-pointer"
                                    onClick={() => handleOpenLine(line._id)}>
                                    <TableCell>
                                      {line.discount_type === "percentage"
                                        ? "Phần trăm"
                                        : "Cố định"}
                                    </TableCell>
                                    <TableCell>{line.description}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>
                                      <div
                                        className=""
                                        onClick={(e) => e.stopPropagation()}>
                                        <Switch checked={line.is_active} />
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <button
                                        onClick={(e) => e.stopPropagation()}>
                                        <AddPromotionDetailDialog
                                          promotionLineId={line._id}
                                        />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingLine(line);
                                        }}
                                        className="text-green-500 px-4">
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

                                  {/* DETAIL TABLE */}
                                  {activeLine === line._id && (
                                    <TableRow>
                                      <TableCell colSpan={5}>
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Cấp bậc</TableHead>
                                              <TableHead>
                                                Giá trị giảm
                                              </TableHead>
                                              <TableHead>
                                                Số tiền tối thiểu
                                              </TableHead>
                                              <TableHead>Trạng thái</TableHead>
                                              <TableHead>Tác vụ</TableHead>
                                            </TableRow>
                                          </TableHeader>

                                          <TableBody>
                                            {promotionDetails.length > 0 ? (
                                              promotionDetails.map((detail) => (
                                                <TableRow key={detail._id}>
                                                  <TableCell>
                                                    {
                                                      detail.applicable_rank_id
                                                        ?.rank_name
                                                    }
                                                  </TableCell>

                                                  <TableCell>
                                                    {detail.discount_value}
                                                  </TableCell>

                                                  <TableCell>
                                                    {detail.min_order_value}
                                                  </TableCell>

                                                  <TableCell>
                                                    <Switch
                                                      checked={detail.is_active}
                                                    />
                                                  </TableCell>
                                                  <TableCell>
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                      }}
                                                      className="text-green-500 px-4">
                                                      Sửa
                                                    </button>

                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                      }}
                                                      className="text-red-500">
                                                      Xóa
                                                    </button>
                                                  </TableCell>
                                                </TableRow>
                                              ))
                                            ) : (
                                              <TableRow>
                                                <TableCell
                                                  colSpan={4}
                                                  className="text-center">
                                                  Không có chi tiết
                                                </TableCell>
                                              </TableRow>
                                            )}
                                          </TableBody>
                                        </Table>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </React.Fragment>
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
        <EditPromotionHeaderDialog
          open={!!editingHeader}
          setOpen={() => setEditingHeader(null)}
          header={editingHeader}
        />
        <EditPromotionLineDialog
          open={!!editingLine}
          setOpen={() => setEditingLine(null)}
          line={editingLine}
        />
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Promotion;
