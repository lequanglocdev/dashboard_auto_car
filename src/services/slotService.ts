import api from "@/lib/axios";
import type Slot from "@/types/slot";

export const slotService = {
  get: async (page: number, limit: number) => {
    const res = await api.get("/slots", {
      params: { page, limit },
      withCredentials: true,
    });
    return res.data;
  },

  add: async (slotData: { start_time: string; capacity?: number }) => {
    const res = await api.post("/slots", slotData, {
      withCredentials: true,
    });
    return res.data;
  },

  update: async (
    id: string,
    data: Partial<
      Omit<Slot, "_id" | "created_at" | "updated_at" | "is_deleted">
    >
  ) => {
    const res = await api.put(`/slots/${id}`, data, {
      withCredentials: true,
    });
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/slots/${id}`, { withCredentials: true });
    return res.data;
  },
};
