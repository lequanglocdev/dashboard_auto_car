// types/invoice.ts
export type InvoiceStatus = "pending" | "paid" | "cancelled" | "back";

export interface InvoiceDetail {
  _id: string;
  invoice_id: string;
  service_id: {
    _id: string;
    name: string;
    description?: string;
  };
  price: number;
  quantity: number;
}

export interface Invoice {
  _id: string;
  customer_id: {
    _id: string;
    name: string;
    phone_number: string;
    email?: string;
    address?: string;
  };
  employee_id: string;
  appointment_id: {
    _id: string;
    appointment_datetime: string;
  };
  promotion_header_ids: string[];
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  status: InvoiceStatus;
  note?: string;
  details?: InvoiceDetail[];
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentLinkResponse {
  checkoutUrl: string;
  qrCode: string;
  orderCode: number;
}
