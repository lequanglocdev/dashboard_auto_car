// stores/usePromotionStore.ts

import { create } from "zustand";
import { toast } from "sonner";
import { promotionService } from "@/services/promotion";
import type { PromotionState } from "@/types/store";

export const usePromotionStore = create<PromotionState>((set) => ({
  promotionHeaders: [],
  promotionLines: [],
  promotionDetails: [],
  loading: false,
  error: null,

  /* ================= HEADER ================= */

  fetchPromotionHeaders: async () => {
    try {
      set({ loading: true });
      const data = await promotionService.getAllHeaders();
      set({ promotionHeaders: data, loading: false });
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      set({ loading: false });
    }
  },

  addPromotionHeader: async (data) => {
    const res = await promotionService.addHeader(data);
    set((state) => ({
      promotionHeaders: [res.promotionHeader, ...state.promotionHeaders],
    }));
    toast.success(res.msg);
  },

  updatePromotionHeader: async (id, data) => {
    const res = await promotionService.updateHeader(id, data);
    set((state) => ({
      promotionHeaders: state.promotionHeaders.map((h) =>
        h._id === id ? res.promotionHeader : h
      ),
    }));
    toast.success(res.msg);
  },

  deletePromotionHeader: async (id) => {
    const res = await promotionService.deleteHeader(id);
    set((state) => ({
      promotionHeaders: state.promotionHeaders.filter((h) => h._id !== id),
    }));
    toast.success(res.msg);
  },

  /* ================= LINE ================= */

  fetchPromotionLines: async (promotionHeaderId) => {
    const data = await promotionService.getLinesByHeader(promotionHeaderId);
    set({ promotionLines: data });
  },

  addPromotionLine: async (promotionHeaderId, data) => {
    const res = await promotionService.addLine(promotionHeaderId, data);
    set((state) => ({
      promotionLines: [res.promotionLine, ...state.promotionLines],
    }));
    toast.success(res.msg);
  },

  updatePromotionLine: async (id, data) => {
    const res = await promotionService.updateLine(id, data);
    set((state) => ({
      promotionLines: state.promotionLines.map((l) =>
        l._id === id ? res.promotionLine : l
      ),
    }));
    toast.success(res.msg);
  },

  deletePromotionLine: async (id) => {
    const res = await promotionService.deleteLine(id);
    set((state) => ({
      promotionLines: state.promotionLines.filter((l) => l._id !== id),
    }));
    toast.success(res.msg);
  },

  /* ================= DETAIL ================= */

  fetchPromotionDetails: async (promotionLineId) => {
    const data = await promotionService.getDetails(promotionLineId);
    set({ promotionDetails: data });
  },

  addPromotionDetail: async (promotionLineId, data) => {
    const res = await promotionService.addDetail(promotionLineId, data);
    set((state) => ({
      promotionDetails: [res.promotionDetail, ...state.promotionDetails],
    }));
    toast.success(res.msg);
  },

  updatePromotionDetail: async (id, data) => {
    const res = await promotionService.updateDetail(id, data);
    set((state) => ({
      promotionDetails: state.promotionDetails.map((d) =>
        d._id === id ? res.promotionDetail : d
      ),
    }));
    toast.success(res.msg);
  },

  deletePromotionDetail: async (id) => {
    const res = await promotionService.deleteDetail(id);
    set((state) => ({
      promotionDetails: state.promotionDetails.filter((d) => d._id !== id),
    }));
    toast.success(res.msg);
  },
}));
