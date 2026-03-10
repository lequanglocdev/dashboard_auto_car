
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
      toast.error(error?.response?.data?.message || "Không thể tải danh sách");
      set({ loading: false });
    }
  },

  addPromotionHeader: async (data) => {
    try {
      const res = await promotionService.addHeader(data);

      set((state) => ({
        promotionHeaders: [res.promotionHeader, ...state.promotionHeaders],
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Thêm khuyến mãi thất bại");
    }
  },

  updatePromotionHeader: async (id, data) => {
    try {
      const res = await promotionService.updateHeader(id, data);

      set((state) => ({
        promotionHeaders: state.promotionHeaders.map((h) =>
          h._id === id ? res.promotionHeader : h
        ),
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật thất bại");
    }
  },

  deletePromotionHeader: async (id) => {
    try {
      const res = await promotionService.deleteHeader(id);

      set((state) => ({
        promotionHeaders: state.promotionHeaders.filter((h) => h._id !== id),
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Xóa thất bại");
    }
  },

  /* ================= LINE ================= */

  fetchPromotionLines: async (promotionHeaderId) => {
    try {
      const data = await promotionService.getLinesByHeader(promotionHeaderId);
      set({ promotionLines: data });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Không thể tải dòng khuyến mãi"
      );
    }
  },

  addPromotionLine: async (promotionHeaderId, data) => {
    try {
      const res = await promotionService.addLine(promotionHeaderId, data);

      set((state) => ({
        promotionLines: [res.promotionLine, ...state.promotionLines],
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Thêm dòng thất bại");
    }
  },

  updatePromotionLine: async (id, data) => {
    try {
      const res = await promotionService.updateLine(id, data);

      set((state) => ({
        promotionLines: state.promotionLines.map((l) =>
          l._id === id ? res.promotionLine : l
        ),
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật dòng thất bại");
    }
  },

  deletePromotionLine: async (id) => {
    try {
      const res = await promotionService.deleteLine(id);

      set((state) => ({
        promotionLines: state.promotionLines.filter((l) => l._id !== id),
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Xóa dòng thất bại");
    }
  },

  /* ================= DETAIL ================= */

  fetchPromotionDetails: async (promotionLineId) => {
    try {
      const data = await promotionService.getDetails(promotionLineId);
      set({ promotionDetails: data });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể tải chi tiết");
    }
  },

  addPromotionDetail: async (promotionLineId, data) => {
    try {
      const res = await promotionService.addDetail(promotionLineId, data);

      set((state) => ({
        promotionDetails: [res.promotionDetail, ...state.promotionDetails],
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Thêm chi tiết thất bại");
    }
  },

  updatePromotionDetail: async (id, data) => {
    try {
      const res = await promotionService.updateDetail(id, data);

      set((state) => ({
        promotionDetails: state.promotionDetails.map((d) =>
          d._id === id ? res.promotionDetail : d
        ),
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Cập nhật chi tiết thất bại"
      );
    }
  },

  deletePromotionDetail: async (id) => {
    try {
      const res = await promotionService.deleteDetail(id);

      set((state) => ({
        promotionDetails: state.promotionDetails.filter((d) => d._id !== id),
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Xóa chi tiết thất bại");
    }
  },
  togglePromotionHead: async (id: string) => {
    try {
      const res = await promotionService.toggleHead(id);

      set((state) => ({
        promotionHeaders: state.promotionHeaders.map((h) =>
          h._id === id ? res.promotionHead : h
        ),
      }));
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  },
  togglePromotionLine: async (id: string) => {
    try {
      const res = await promotionService.toggleLine(id);

      set((state) => ({
        promotionLines: state.promotionLines.map((h) =>
          h._id === id ? res.promotionLine : h
        ),
      }));
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  },
  togglePromotionDetail: async (id: string) => {
    try {
      const res = await promotionService.toggleDetail(id);

      set((state) => ({
        promotionDetails: state.promotionDetails.map((h) =>
          h._id === id ? res.promotionDetail : h
        ),
      }));
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  },
}));
