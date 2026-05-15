import { slotService } from "@/services/slotService";
import type Slot from "@/types/slot";
import type { SlotsState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";

export const useSlotsStore = create<SlotsState>((set) => ({
  slots: [],
  loading: false,
  total: 0,
  page: 1,
  limit: 10,
  error: null,

  fetchSlots: async (page = 1, limit = 10) => {
    try {
      set({ loading: true });
      const data = await slotService.get(page, limit);

      // backend trả về array thẳng, không phải { slots, total }
      const slotArray = Array.isArray(data) ? data : data.slots || [];

      set({
        slots: slotArray,
        total: slotArray.length,
        page,
        limit,
        loading: false,
      });
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tải slot");
    } finally {
      set({ loading: false });
    }
  },

  addSlot: async (slotData) => {
    try {
      const res = await slotService.add(slotData);
      const newSlot = res.slot;
      const mapped: Slot = {
        _id: newSlot._id,
        start_time: newSlot.start_time,
        status: newSlot.status,
        capacity: newSlot.capacity,
        is_deleted: newSlot.is_deleted,
        created_at: newSlot.created_at,
        updated_at: newSlot.updated_at,
      };
      set((state) => ({
        slots: [mapped, ...state.slots],
        total: state.total + 1,
      }));
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },

  updateSlot: async (id, slotData) => {
    try {
      const res = await slotService.update(id, slotData);
      const updatedSlot = res.data;
      set((state) => ({
        slots: state.slots.map((s) => (s._id === id ? updatedSlot : s)),
      }));
      toast.success("Cập nhật slot thành công");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },

  deleteSlot: async (id) => {
    try {
      await slotService.delete(id);
      set((state) => ({
        slots: state.slots.filter((s) => s._id !== id),
        total: state.total - 1,
      }));
      toast.success("Xóa slot thành công");
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },
}));
