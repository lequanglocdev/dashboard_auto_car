// services/promotion.ts

import api from "@/lib/axios";
import type {
  CreatePromotionHeader,
  UpdatePromotionHeader,
  CreatePromotionLine,
  UpdatePromotionLine,
  CreatePromotionDetail,
  UpdatePromotionDetail,
} from "@/types/promotion";

export const promotionService = {
  /* ================= HEADER ================= */

  getAllHeaders: async () => {
    const res = await api.get("/promotion");
    return res.data;
  },

  addHeader: async (data: CreatePromotionHeader) => {
    const res = await api.post("/promotion", data); 
    return res.data;
  },

  updateHeader: async (id: string, data: UpdatePromotionHeader) => {
    const res = await api.put(`/promotion/${id}`, data);
    return res.data;
  },

  deleteHeader: async (id: string) => {
    const res = await api.delete(`/promotion/${id}`);
    return res.data;
  },

  /* ================= LINE ================= */

  getLinesByHeader: async (promotionHeaderId: string) => {
    const res = await api.get(`/promotion/${promotionHeaderId}/line`);
    return res.data;
  },

  addLine: async (promotionHeaderId: string, data: CreatePromotionLine) => {
    const res = await api.post(`/promotion/${promotionHeaderId}/line`, data);
    return res.data;
  },

  updateLine: async (id: string, data: UpdatePromotionLine) => {
    const res = await api.put(`/promotion/line/${id}`, data);
    return res.data;
  },

  deleteLine: async (id: string) => {
    const res = await api.delete(`/promotion/line/${id}`);
    return res.data;
  },

  /* ================= DETAIL ================= */

  getDetails: async (promotionLineId: string) => {
    const res = await api.get(`/promotion/line/${promotionLineId}/detail`);
    return res.data;
  },

  addDetail: async (promotionLineId: string, data: CreatePromotionDetail) => {
    const res = await api.post(
      `/promotion/line/${promotionLineId}/detail`,
      data
    );
    return res.data;
  },

  updateDetail: async (id: string, data: UpdatePromotionDetail) => {
    const res = await api.put(`/promotion/detail/${id}`, data);
    return res.data;
  },

  deleteDetail: async (id: string) => {
    const res = await api.delete(`/promotion/detail/${id}`);
    return res.data;
  },
};
