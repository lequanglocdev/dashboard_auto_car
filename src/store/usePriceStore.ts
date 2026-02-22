import { create } from "zustand";
import { toast } from "sonner";
import { priceService } from "@/services/price";
import type { PriceState } from "@/types/store";


export const usePriceStore = create<PriceState>((set) => ({
  priceHeaders: [],
  priceLines: [],
  loading: false,
  error: null,

  // ================= HEADER =================
  fetchPriceHeaders: async () => {
    try {
      set({ loading: true });
      const data = await priceService.getAllHeaders();
      set({ priceHeaders: data, loading: false });
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tải bảng giá");
      set({ loading: false });
    }
  },

  addPriceHeader: async (data) => {
    try {
      const res = await priceService.addHeader(data);

      set((state) => ({
        priceHeaders: [res.priceHeader, ...state.priceHeaders],
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },

  updatePriceHeader: async (id, data) => {
    try {
      const res = await priceService.updateHeader(id, data);

      set((state) => ({
        priceHeaders: state.priceHeaders.map((h) =>
          h._id === id ? res.priceHeader : h
        ),
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  },

  deletePriceHeader: async (id) => {
    try {
      const res = await priceService.deleteHeader(id);

      set((state) => ({
        priceHeaders: state.priceHeaders.filter((h) => h._id !== id),
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  },

  // ================= LINE =================
  fetchPriceLines: async (priceHeaderId) => {
    try {
      set({ loading: true });
      const data = await priceService.getLinesByHeader(priceHeaderId);
      set({ priceLines: data, loading: false });
    } catch (error: any) {
      toast.error(error.message);
      set({ loading: false });
    }
  },

  addPriceLine: async (priceHeaderId, data) => {
    try {
      const res = await priceService.addLine(priceHeaderId, data);
      console.log("add response", res.priceLine);

      set((state) => ({
        priceLines: [res.priceLine, ...state.priceLines],
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },

  updatePriceLine: async (id, data) => {
    try {
      const res = await priceService.updateLine(id, data);

      set((state) => ({
        priceLines: state.priceLines.map((l) =>
          l._id === id ? res.priceLine : l
        ),
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  },

  deletePriceLine: async (id) => {
    try {
      const res = await priceService.deleteLine(id);

      set((state) => ({
        priceLines: state.priceLines.filter((l) => l._id !== id),
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  },
  togglePriceLine: async (id: string) => {
    const res = await priceService.toggleLine(id);

    set((state) => ({
      priceLines: state.priceLines.map((line) =>
        line._id === id ? res.priceLine : line
      ),
    }));
  },
}));
