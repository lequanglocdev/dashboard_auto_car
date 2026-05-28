// services/invoiceService.ts
import api from "@/lib/axios";
import type { Invoice, CreatePaymentLinkResponse } from "@/types/invoice";

export const invoiceService = {
  getAll: async (params?: {
    status?: string;
    date?: string;
  }): Promise<Invoice[]> => {
    const res = await api.get("/invoices", { params });
    return res.data.invoices;
  },

  generate: async (appointmentId: string): Promise<Invoice> => {
    const res = await api.post(`/invoices/generate/${appointmentId}`);
    return res.data.invoice;
  },

  getById: async (invoiceId: string): Promise<Invoice> => {
    const res = await api.get(`/invoices/${invoiceId}`);
    return res.data.invoice;
  },

  payDirectly: async (invoiceId: string): Promise<Invoice> => {
    const res = await api.post(`/invoices/pay/directly/${invoiceId}`);
    return res.data.invoice;
  },

  createPaymentLink: async (
    invoiceId: string
  ): Promise<CreatePaymentLinkResponse> => {
    const res = await api.post(`/invoices/pay/online/${invoiceId}`);
    return res.data;
  },

  refund: async (invoiceId: string, note?: string): Promise<void> => {
    await api.post("/invoices/refund", { invoiceId, note });
  },
  
  downloadPDF: async (invoiceId: string): Promise<void> => {
    const res = await api.get(`/invoices/pdf/${invoiceId}`, {
      responseType: "blob", // ← quan trọng
    });

    // Tạo link download
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice_${invoiceId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
