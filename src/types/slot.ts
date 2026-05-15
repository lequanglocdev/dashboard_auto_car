export default interface Slot {
  _id: string;
  start_time: string;
  status: "available" | "booked" | "unavailable";
  capacity: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
