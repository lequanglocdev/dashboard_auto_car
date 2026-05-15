// components/SlotCard.tsx
import { useAppointmentStore } from "@/store/useAppointmentStore";
import type Slot from "@/types/slot";

interface Booking {
  duration: number;
  booked_at: string;
  name: string;
  phone: string;
}

interface SlotCardProps {
  slot: Slot & { booking?: Booking };
  onBook?: (id: string) => void;
  onComplete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function SlotCard({ slot, onBook, onComplete, onView }: SlotCardProps) {
  const isBooked = slot.status === "booked";
  const { openModal } = useAppointmentStore();
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card border-gray-200 min-h-[200px]">
      {/* Header */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 text-white font-bold text-[15px] ${
          isBooked ? "bg-red-700" : "bg-green-700"
        }`}>
        <span>Khu vực chăm sóc</span>
        <span className="text-sm font-semibold">
          {isBooked ? "Đang xử lý" : "Nhận xe"}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 bg-secondary px-3 py-2.5 text-sm text-muted-foreground space-y-0.5">
        {isBooked && slot.booking ? (
          <>
            {/* <p>Thời gian hoàn thành: {slot.booking.start_time} phút</p>
            <p>Thời gian đặt: {slot.booking.booked_at}</p>
            <p>Tên: {slot.booking.name}</p>
            <p>Số điện thoại: {slot.booking.phone}</p> */}
          </>
        ) : null}
      </div>

      {/* Footer */}
      <div className="flex">
        {isBooked ? (
          <>
            <button
              onClick={() => onComplete?.(slot._id)}
              className="flex-1 py-2.5 bg-orange-600 text-white font-semibold text-sm hover:bg-orange-500 transition">
              Hoàn tất chăm sóc
            </button>
            <button
              onClick={() => onView?.(slot._id)}
              className="w-16 py-2.5 bg-green-700 text-white font-semibold text-sm hover:bg-green-700 transition">
              Xem
            </button>
          </>
        ) : (
          <button
            onClick={() => openModal()}
            className="flex-1 py-2.5 bg-blue-700 text-white font-semibold text-sm hover:bg-blue-600 transition">
            Đặt dịch vụ
          </button>
        )}
      </div>
    </div>
  );
}
