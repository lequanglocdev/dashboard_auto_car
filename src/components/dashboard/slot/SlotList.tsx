import { useEffect } from "react";
import { SlotCard } from "./SlotCard";
import { useSlotsStore } from "@/store/slotStore";
import AppointmentModal from "@/pages/dashboard/appointment/AppointmentModal";

export function SlotList() {
  const { slots, loading, fetchSlots } = useSlotsStore();

  useEffect(() => {
    fetchSlots(1, 10);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-52 rounded-lg bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center text-xl font-bold italic text-red-500 mb-4">
        Khu vực chăm sóc khách hàng
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {slots.map((slot) => (
          <SlotCard
            key={slot._id}
            slot={slot}
            onBook={(id) => console.log("book", id)}
            onComplete={(id) => console.log("complete", id)}
            onView={(id) => console.log("view", id)}
          />
        ))}
      </div>
      <AppointmentModal />
    </div>
  );
}
