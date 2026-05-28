// components/SlotCard.tsx
import { useAppointmentStore } from "@/store/useAppointmentStore";
import type Slot from "@/types/slot";
import { Car} from "lucide-react";
import { memo } from "react";
interface Booking {
  duration: number;
  booked_at: string;
  name: string;
  phone: string;
}

interface SlotCardProps {
  slot: Slot & { booking?: Booking };
  onBook?: (id: string) => void;
  onView?: (id: string) => void;
}

export const SlotCard = memo(({ slot, onView }: SlotCardProps) => {
  const isBooked = slot.status === "booked";
  const { openModal } = useAppointmentStore();
  const formatVN = (isoString: string) => {
    return new Date(isoString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card min-h-[200px] shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 text-white ${
          isBooked ? "bg-rose-700" : " bg-cyan-800"
        }`}>
        <div className="flex items-center gap-2">
          <Car size={16} className="opacity-80" />
          <span className="font-semibold text-sm">Khu vực chăm sóc</span>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            isBooked
              ? "bg-white/15 text-white/90 border border-white/25"
              : "bg-white/15 text-white/90 border border-white/20"
          }`}>
          {isBooked ? "Đang xử lý" : "Nhận xe"}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 bg-secondary/50 px-4 py-3 text-sm text-muted-foreground space-y-1.5">
        {isBooked && slot.booking ? (
          <>
            {slot.booking.name && (
              <p className="font-medium">
                Tên: {slot.booking.name}
              </p>
            )}
            {slot.booking.phone && (
              <p className="font-medium">
                Điện thoại: {slot.booking.phone}
              </p>
            )}
            {slot.booking.duration > 0 && (
              <p className="font-medium">
                Thời gian hoàn thành: {slot.booking.duration} phút
              </p>
            )}
            {slot.booking.booked_at && (
              <p className="font-medium ">
                Thời gian đặt lịch: {formatVN(slot.booking.booked_at)}
              </p>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center pt-3 pb-1">
            <p className="text-xs text-muted-foreground/50 flex flex-col items-center gap-1">
              <Car size={20} className="opacity-30" />
              Chưa có xe
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full flex items-center">
        {isBooked ? (
          <>
            <button
              onClick={() => onView?.(slot._id)}
              className="w-full py-2.5 bg-rose-900 text-white font-semibold text-sm hover:bg-rose-800 border-l border-rose-600 transition">
              Xem
            </button>
          </>
        ) : (
          <button
            onClick={() => openModal(undefined, slot._id)}
            className="flex-1 py-2.5 bg-cyan-600 text-white font-semibold text-sm hover:bg-cyan-500 transition">
            Đặt dịch vụ
          </button>
        )}
      </div>
    </div>
  );
});
