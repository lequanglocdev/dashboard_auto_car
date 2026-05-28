// pages/dashboard/invoice/Invoice.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/Sidebar";
import Navbar from "@/components/dashboard/navbar/Navbar";
import AppSidebar from "@/components/dashboard/appsidebar/AppSidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import type { InvoiceStatus } from "@/types/invoice";

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Chờ thanh toán",
    className: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
  paid: {
    label: "Đã thanh toán",
    className: "bg-green-100  text-green-700  border-green-300",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-red-100    text-red-700    border-red-300",
  },
  back: {
    label: "Đã hoàn trả",
    className: "bg-gray-100   text-gray-600   border-gray-300",
  },
};

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "pending", label: "Chờ thanh toán" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "back", label: "Đã hoàn trả" },
];

export default function Invoice() {
  const navigate = useNavigate();
  const { invoices, isLoading, fetchInvoices } = useInvoiceStore();
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchInvoices({
      status: filterStatus || undefined,
      date: filterDate || undefined,
    });
  }, [filterStatus, filterDate]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={true}>
        <div className="h-screen w-full bg-muted/40 flex overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Hóa đơn</h1>
              </div>

              {/* Filters */}
              <div className="flex gap-3 mb-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm bg-background">
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-sm bg-background"
                />
                {(filterStatus || filterDate) && (
                  <button
                    onClick={() => {
                      setFilterStatus("");
                      setFilterDate("");
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition">
                    Xóa bộ lọc
                  </button>
                )}
              </div>

              {/* Table */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Khách hàng</th>
                      <th className="px-4 py-3 text-left">Ngày tạo</th>
                      <th className="px-4 py-3 text-right">Tổng tiền</th>
                      <th className="px-4 py-3 text-right">Giảm giá</th>
                      <th className="px-4 py-3 text-right">Thực thu</th>
                      <th className="px-4 py-3 text-center">Trạng thái</th>
                      <th className="px-4 py-3 text-center">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-t border-border">
                          {Array.from({ length: 7 }).map((__, j) => (
                            <td key={j} className="px-4 py-3">
                              <div className="h-4 bg-muted animate-pulse rounded" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : invoices.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-10 text-center text-muted-foreground">
                          Không có hóa đơn nào
                        </td>
                      </tr>
                    ) : (
                      invoices.map((inv) => {
                        const cfg = STATUS_CONFIG[inv.status];
                        return (
                          <tr
                            key={inv._id}
                            className="border-t border-border hover:bg-muted/30 transition">
                            <td className="px-4 py-3 font-medium">
                              {inv.customer_id.name}
                              <p className="text-xs text-muted-foreground font-normal">
                                {inv.customer_id.phone_number}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {new Date(inv.created_at).toLocaleDateString(
                                "vi-VN"
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {inv.total_amount.toLocaleString("vi-VN")} đ
                            </td>
                            <td className="px-4 py-3 text-right text-green-600">
                              {inv.discount_amount > 0
                                ? `- ${inv.discount_amount.toLocaleString(
                                    "vi-VN"
                                  )} đ`
                                : "—"}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold">
                              {inv.final_amount.toLocaleString("vi-VN")} đ
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.className}`}>
                                {cfg.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => navigate(`/invoice/${inv._id}`)}
                                className="text-xs text-blue-600 hover:underline">
                                Xem
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
