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
import { Switch } from "@/components/ui/switch";
import { AddPromotionHeader } from "./AddPromotionHeader";
import AddPromotionLineDialog from "./AddPromotionLineDialog";
import { EditPromotionHeaderDialog } from "./EditPromotionHeaderDialog";
import { EditPromotionLineDialog } from "./EditPromotionLineDialog";
import AddPromotionDetailDialog from "./AddPromotionDetail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { EditPromotionDetailDialog } from "./EditPromotionDetailDialog";

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

  const [activeHeader, setActiveHeader] = useState<string | null>(null);
  const [activeLine, setActiveLine] = useState<string | null>(null);

  const [editingHeader, setEditingHeader] = useState<any>(null);
  const [editingLine, setEditingLine] = useState<any>(null);
  const [editingDetail, setEditingDetail] = useState<any>(null);

  const deletePromotionHeader = usePromotionStore(
    (state) => state.deletePromotionHeader
  );
  const deletePromotionLine = usePromotionStore(
    (state) => state.deletePromotionLine
  );
  const deletePromotionDetail = usePromotionStore((state) => state.deletePromotionDetail)

  useEffect(() => {
    fetchPromotionHeaders();
  }, []);

  const handleOpen = async (value: string) => {
    setActiveHeader(value);
    await fetchPromotionLines(value);
  };

  const handleOpenLine = async (lineId: string) => {
    if (activeLine === lineId) {
      setActiveLine(null);
      return;
    }
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
              <div className="flex items-center justify-end mb-8">
                <AddPromotionHeader />
              </div>
              <div className="bg-destructive/40 p-4 grid grid-cols-7 rounded-md text-sm font-semibold">
                <span>Mã khuyến mãi</span>
                <span>Tên khuyến mãi</span>
                <span>Mô tả</span>
                <span>Ngày bắt đầu</span>
                <span>Ngày kết thúc</span>
                <span>Trạng thái</span>
                <span className="text-right">TÁC VỤ</span>
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
                        <span>
                          {new Date(header.start_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        <span>
                          {new Date(header.end_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        <div className="" onClick={(e) => e.stopPropagation()}>
                          <Switch checked={header.is_active} />
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
                                <AddPromotionLineDialog headerId={header._id} />
                              </div>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setEditingHeader(header)}>
                                Sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  deletePromotionHeader(header._id)
                                }
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
                              <TableHead>Loại giảm giá </TableHead>
                              <TableHead>Mô tả dòng</TableHead>
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
                                    <TableCell>
                                      <div
                                        className=""
                                        onClick={(e) => e.stopPropagation()}>
                                        <Switch checked={line.is_active} />
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
                                          <div>
                                            <AddPromotionDetailDialog
                                              promotionLineId={line._id}
                                            />
                                          </div>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            onClick={() =>
                                              setEditingLine(line)
                                            }>
                                            Sửa
                                          </DropdownMenuItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            onClick={() =>
                                              deletePromotionLine(line._id)
                                            }
                                            variant="destructive"
                                            className="text-red-500">
                                            Xóa
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
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
                                                    <DropdownMenu>
                                                      <DropdownMenuTrigger
                                                        asChild>
                                                        <Button
                                                          variant="ghost"
                                                          size="icon"
                                                          className="size-8">
                                                          <MoreHorizontalIcon />
                                                        </Button>
                                                      </DropdownMenuTrigger>
                                                      <DropdownMenuContent align="end">
                                                        <div>
                                                          <AddPromotionDetailDialog
                                                            promotionLineId={
                                                              line._id
                                                            }
                                                          />
                                                        </div>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                          onClick={() =>
                                                            setEditingDetail(
                                                              detail
                                                            )
                                                          }>
                                                          Sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                          onClick={() =>
                                                            deletePromotionDetail(
                                                              detail._id
                                                            )
                                                          }
                                                          variant="destructive"
                                                          className="text-red-500">
                                                          Xóa
                                                        </DropdownMenuItem>
                                                      </DropdownMenuContent>
                                                    </DropdownMenu>
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
        <EditPromotionDetailDialog
          open={!!editingDetail}
          setOpen={() => setEditingDetail(null)}
          detail={editingDetail}
        />
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Promotion;
