import { create } from "zustand";
import { customerService } from "@/services/customer";

import { toast } from "sonner";
import type Customer from "@/types/customer";
import type { CustomerState } from "@/types/store";

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  loading: false,
  total: 0,
  page: 1,
  limit: 10,
  error: null,

  fetchCustomers: async (page = 1, limit = 10) => {
    try {
      set({ loading: true });

      const data = await customerService.getAll(page, limit);

      set({
        customers: data.customers || [],
        total: data.total || 0,
        page,
        limit,
        loading: false,
      });
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tải khách hàng");
    } finally {
      set({ loading: false });
    }
  },

  addCustomer: async (customerData) => {
    try {
      const res = await customerService.add(customerData);
      const newCustomer = res.data;
      const mapped: Customer = {
        _id: newCustomer.id ?? newCustomer._id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone_number: newCustomer.phone_number,
        address: newCustomer.address,
      };
      set((state) => ({
        customers: [mapped, ...state.customers],
        total: state.total + 1,
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      const res = await customerService.update(id, customerData);

      set((state) => ({
        customers: state.customers.map((c) => (c._id === id ? res.data : c)),
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  },

  deleteCustomer: async (id) => {
    try {
     const res = await customerService.delete(id);

      set((state) => ({
        customers: state.customers.filter((c) => c._id !== id),
        total: state.total - 1,
      }));

      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message || "Xóa khách hàng thất bại");
    }
  },
  getCustomerById: async (id: any) => {
    try {
      const res = await customerService.getById(id);
      return res;
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tải khách hàng");
      throw error;
    }
  },
  getCustomerByIdWithVehicles: async (id: any) => {
    try {
      const res = await customerService.getByIdWithVehicles(id);
      return res;
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tải khách hàng cùng xe");
      throw error;
    }
  },
}));
