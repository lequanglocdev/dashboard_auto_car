// pages/dashboard/invoice/InvoicePrint.tsx
import type { Invoice } from "@/types/invoice";

interface Props {
  invoice: Invoice;
}

export function InvoicePrint({ invoice }: Props) {
  return (
    <>
      {/* CSS print — chỉ áp dụng khi in */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-print, #invoice-print * { visibility: visible; }
          #invoice-print {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
          }
        }
      `}</style>

      <div
        id="invoice-print"
        style={{ display: "none" }}
        className="p-10 max-w-2xl mx-auto text-black text-sm font-sans">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-wide">HÓA ĐƠN DỊCH VỤ</h1>
          <p className="text-gray-500 text-xs mt-1">#{invoice._id}</p>
          <p className="text-gray-500 text-xs">
            Ngày lập: {new Date(invoice.created_at).toLocaleString("vi-VN")}
          </p>
        </div>

        {/* Thông tin 2 cột */}
        <div className="grid grid-cols-2 gap-6 border-t border-b border-gray-300 py-4 mb-6">
          <div>
            <p className="font-semibold text-xs uppercase text-gray-400 mb-1">
              Khách hàng
            </p>
            <p className="font-semibold">{invoice.customer_id.name}</p>
            <p className="text-gray-600">{invoice.customer_id.phone_number}</p>
            {invoice.customer_id.email && (
              <p className="text-gray-600">{invoice.customer_id.email}</p>
            )}
          </div>
          <div>
            <p className="font-semibold text-xs uppercase text-gray-400 mb-1">
              Nhân viên phụ trách
            </p>
            <p className="font-semibold">
              {(invoice.employee_id as any)?.username ?? "—"}
            </p>
            <p className="text-gray-600">
              {(invoice.employee_id as any)?.email ?? ""}
            </p>
            <p className="font-semibold text-xs uppercase text-gray-400 mb-1 mt-3">
              Ngày hẹn
            </p>
            <p className="text-gray-600">
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
        </div>

        {/* Bảng dịch vụ */}
        <table className="w-full mb-6 text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 font-semibold">Dịch vụ</th>
              <th className="text-center py-2 font-semibold">SL</th>
              <th className="text-right py-2 font-semibold">Đơn giá</th>
              <th className="text-right py-2 font-semibold">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {invoice.details?.map((d) => (
              <tr key={d._id} className="border-b border-gray-200">
                <td className="py-2">{d.service_id.name}</td>
                <td className="py-2 text-center">{d.quantity}</td>
                <td className="py-2 text-right">
                  {d.price.toLocaleString("vi-VN")} đ
                </td>
                <td className="py-2 text-right">
                  {(d.price * d.quantity).toLocaleString("vi-VN")} đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tổng tiền */}
        <div className="space-y-1 text-right border-t border-gray-300 pt-3">
          <div className="flex justify-between text-gray-600">
            <span>Tạm tính</span>
            <span>{invoice.total_amount.toLocaleString("vi-VN")} đ</span>
          </div>
          {invoice.discount_amount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Giảm giá (khuyến mãi)</span>
              <span>- {invoice.discount_amount.toLocaleString("vi-VN")} đ</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base border-t border-gray-300 pt-2 mt-1">
            <span>Tổng thanh toán</span>
            <span>{invoice.final_amount.toLocaleString("vi-VN")} đ</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-400 text-xs">
          <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
          <p className="mt-1">Hóa đơn được xuất tự động từ hệ thống.</p>
        </div>
      </div>
    </>
  );
}
