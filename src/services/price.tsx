import api from "@/lib/axios";

export const priceService = {
  // ===== HEADER =====
  getAllHeaders: async () => {
    const res = await api.get("/price");
    return res.data;
  },

  addHeader: async (data: any) => {
    const res = await api.post("/price", data);
    return res.data;
  },

  updateHeader: async (id: string, data: any) => {
    const res = await api.put(`/price/${id}`, data);
    return res.data;
  },

  deleteHeader: async (id: string) => {
    const res = await api.delete(`/price/${id}`);
    return res.data;
  },

  // ===== LINE =====
  getLinesByHeader: async (priceHeaderId: string) => {
    const res = await api.get(`/price/${priceHeaderId}/line`);
    return res.data;
  },

  addLine: async (priceHeaderId: string, data: any) => {
    const res = await api.post(`/price/${priceHeaderId}/line`, data);
    return res.data;
  },

  updateLine: async (id: string, data: any) => {
    const res = await api.put(`/price/line/${id}`, data);
    return res.data;
  },

  deleteLine: async (id: string) => {
    const res = await api.delete(`/price/line/${id}`);
    return res.data;
  },
  toggleLine: async (id: string) => {
    const res = await api.patch(`/price/line/${id}/toggle`);
    return res.data;
  },
};
