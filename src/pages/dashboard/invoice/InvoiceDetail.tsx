// pages/dashboard/invoice/InvoiceDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/Sidebar";
import Navbar from "@/components/dashboard/navbar/Navbar";
import AppSidebar from "@/components/dashboard/appsidebar/AppSidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import {
  Banknote,
  QrCode,
  RotateCcw,
  Printer,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import type { InvoiceStatus } from "@/types/invoice";
import { InvoicePrint } from "./InvoicePrint";
import { invoiceService } from "@/services/invoiceService";

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Chờ thanh toán",
    className: "text-yellow-600 bg-yellow-50 border-yellow-300",
  },
  paid: {
    label: "Đã thanh toán",
    className: "text-green-600  bg-green-50  border-green-300",
  },
  cancelled: {
    label: "Đã hủy",
    className: "text-red-600    bg-red-50    border-red-300",
  },
  back: {
    label: "Đã hoàn trả",
    className: "text-gray-600   bg-gray-50   border-gray-300",
  },
};

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const navigate = useNavigate();

  const {
    invoice,
    isLoading,
    generateInvoice,
    getInvoice,
    payDirectly,
    createPaymentLink,
    refund,
  } = useInvoiceStore();

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundNote, setRefundNote] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      // Đến từ ServiceProgressModal → generate rồi hiển thị
      generateInvoice(appointmentId).catch(() => {});
    } else if (id) {
      // Đến từ danh sách → chỉ get
      getInvoice(id);
    }
  }, [id, appointmentId]);

  const handlePayOnline = async () => {
    if (!invoice) return;
    setRedirecting(true);
    try {
      const url = await createPaymentLink(invoice._id);
      window.location.href = url;
    } catch {
      setRedirecting(false);
    }
  };

  const handleRefund = async () => {
    if (!invoice) return;
    await refund(invoice._id, refundNote);
    setShowRefundModal(false);
    setRefundNote("");
  };

  const isPending = invoice?.status === "pending";
  const isPaid = invoice?.status === "paid";

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={true}>
        <div className="h-screen w-full bg-muted/40 flex overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-6">
              {/* Back */}
              <button
                onClick={() => navigate("/invoice")}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition">
                <ArrowLeft size={16} />
                Danh sách hóa đơn
              </button>

              {isLoading && !invoice ? (
                <div className="flex justify-center pt-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              ) : !invoice ? (
                <p className="text-center text-muted-foreground pt-20">
                  Không tìm thấy hóa đơn.
                </p>
              ) : (
                <div className="max-w-2xl mx-auto space-y-5">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xl font-semibold">
                        Chi tiết hóa đơn
                      </h5>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                        STATUS_CONFIG[invoice.status].className
                      }`}>
                      {STATUS_CONFIG[invoice.status].label}
                    </span>
                  </div>

                  {/* Thông tin khách hàng */}
                  <div className="rounded-xl border border-border bg-card p-5 space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Khách hàng
                    </p>
                    <p className="font-medium">{invoice.customer_id.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.customer_id.phone_number}
                    </p>
                    {invoice.customer_id.email && (
                      <p className="text-sm text-muted-foreground">
                        {invoice.customer_id.email}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground pt-1">
                      Ngày hẹn:{" "}
                      {new Date(
                        invoice.appointment_id.appointment_datetime
                      ).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Chi tiết dịch vụ */}
                  <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <p className="text-xs font-semibold text-muted-foreground uppercase px-5 pt-4 pb-2">
                      Dịch vụ
                    </p>
                    <table className="w-full text-sm">
                      <thead className="bg-muted text-muted-foreground text-xs uppercase">
                        <tr>
                          <th className="px-5 py-2 text-left">Tên dịch vụ</th>
                          <th className="px-5 py-2 text-right">Đơn giá</th>
                          <th className="px-5 py-2 text-center">SL</th>
                          <th className="px-5 py-2 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.details?.map((d) => (
                          <tr key={d._id} className="border-t border-border">
                            <td className="px-5 py-3">{d.service_id.name}</td>
                            <td className="px-5 py-3 text-right">
                              {d.price.toLocaleString("vi-VN")} đ
                            </td>
                            <td className="px-5 py-3 text-center">
                              {d.quantity}
                            </td>
                            <td className="px-5 py-3 text-right font-medium">
                              {(d.price * d.quantity).toLocaleString("vi-VN")} đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Tổng */}
                    <div className="border-t border-border px-5 py-4 space-y-2 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tạm tính</span>
                        <span>
                          {invoice.total_amount.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                      {invoice.discount_amount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá (khuyến mãi)</span>
                          <span>
                            - {invoice.discount_amount.toLocaleString("vi-VN")}{" "}
                            đ
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                        <span>Tổng thanh toán</span>
                        <span className="text-blue-600">
                          {invoice.final_amount.toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {isPending && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => payDirectly(invoice._id)}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-500 disabled:opacity-50 transition">
                        <Banknote size={18} />
                        Tiền mặt
                      </button>
                      <button
                        onClick={handlePayOnline}
                        disabled={isLoading || redirecting}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-50 transition">
                        <QrCode size={18} />
                        {redirecting ? "Đang chuyển..." : "Thanh toán online"}
                      </button>
                    </div>
                  )}

                  {isPaid && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 py-3 bg-green-50 dark:bg-green-950/40 rounded-xl border border-green-200 text-green-600 font-medium">
                        <CheckCircle2 size={20} />
                        Đã thanh toán thành công
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() =>
                            invoiceService.downloadPDF(invoice._id)
                          }
                          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-muted text-sm transition">
                          <Printer size={16} />
                          Xuất PDF
                        </button>
                        <button
                          onClick={() => setShowRefundModal(true)}
                          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-sm transition">
                          <RotateCcw size={16} />
                          Hoàn trả
                        </button>
                      </div>

                      {/* Component print — ẩn trên màn hình, hiện khi in */}
                      <InvoicePrint invoice={invoice} />
                    </div>
                  )}
                </div>
              )}

              {/* Refund Modal */}
              {showRefundModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4">
                    <h3 className="font-semibold">Xác nhận hoàn trả</h3>
                    <p className="text-sm text-muted-foreground">
                      Hành động này sẽ đảo ngược thanh toán và trừ điểm tích lũy
                      của khách hàng.
                    </p>
                    <textarea
                      value={refundNote}
                      onChange={(e) => setRefundNote(e.target.value)}
                      placeholder="Lý do hoàn trả (tuỳ chọn)..."
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowRefundModal(false)}
                        className="px-4 py-2 text-sm rounded-lg border hover:bg-muted transition">
                        Hủy
                      </button>
                      <button
                        onClick={handleRefund}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 transition">
                        Xác nhận
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
