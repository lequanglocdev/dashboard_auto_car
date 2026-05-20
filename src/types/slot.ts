// types/slot.ts
export default interface Slot {
  _id: string;
  start_time: string;
  status: "available" | "booked";
  is_deleted: boolean;
  booking?: {
    name: string;
    phone: string;
    duration: number;
    booked_at: string;
    appointment_id: string;
    vehicle: string;
  };
}
