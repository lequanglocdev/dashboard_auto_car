// store/useInvoiceStore.ts
import { create } from "zustand";
import { toast } from "sonner";
import { invoiceService } from "@/services/invoiceService";
import type { InvoiceState } from "@/types/store";

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: [],
  invoice: null,
  isLoading: false,

  fetchInvoices: async (params) => {
    set({ isLoading: true });
    try {
      const invoices = await invoiceService.getAll(params);
      set({ invoices });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      set({ isLoading: false });
    }
  },

  generateInvoice: async (appointmentId) => {
    set({ isLoading: true });
    try {
      const invoice = await invoiceService.generate(appointmentId);
      set({ invoice });
    } catch (e: any) {
      set({ isLoading: false });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  getInvoice: async (invoiceId) => {
    set({ isLoading: true });
    try {
      const invoice = await invoiceService.getById(invoiceId);
      set({ invoice });
    } finally {
      set({ isLoading: false });
    }
  },

  payDirectly: async (invoiceId) => {
    set({ isLoading: true });
    try {
      const updated = await invoiceService.payDirectly(invoiceId);
      set({ invoice: updated });
      toast.success("Thanh toán tiền mặt thành công!");
    } catch (e: any) {
      toast.error(e.message);
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  createPaymentLink: async (invoiceId) => {
    set({ isLoading: true });
    try {
      const { checkoutUrl } = await invoiceService.createPaymentLink(invoiceId);
      return checkoutUrl;
    } catch (e: any) {
      toast.error(e.message);
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  refund: async (invoiceId, note) => {
    set({ isLoading: true });
    try {
      await invoiceService.refund(invoiceId, note);
      set((s) =>
        s.invoice ? { invoice: { ...s.invoice, status: "back" } } : {}
      );
      toast.success("Hoàn trả thành công");
    } catch (e: any) {
      toast.error(e.message);
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  clearInvoice: () => set({ invoice: null }),
}));
