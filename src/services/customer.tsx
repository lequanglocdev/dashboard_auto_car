import api from "@/lib/axios";
import type Customer from "@/types/customer";


export const customerService = {
  // Define customer-related service methods here
  getAll: async (page: number, limit: number) => {
    const res = await api.get("/customers", {
      params: { page, limit },
      withCredentials: true,
    });
    return res.data;
  },
  add: async (customerData: {
    name: string;
    email: string;
    phone_number: string;
    address: string;
  }) => {
    const res = await api.post("/customers", customerData, {
      withCredentials: true,
    });
    return res.data;
  },
  update: async (id: string, data: Partial<Customer>) => {
    const res = await api.put(`/customers/${id}`, data, {
      withCredentials: true,
    });
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/customers/${id}`, { withCredentials: true });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get(`/customers/${id}`, { withCredentials: true });
    return res.data;
  },
  getByIdWithVehicles: async (id: string) => {
    const res = await api.get(`/customers/${id}`, {
      withCredentials: true,
    });
    return res.data;
  }
};


export const customerRankService = {
  getAll: async (page: number, limit: number) => {
    const res = await api.get("/customer-ranks", {
      params: { page, limit },
      withCredentials: true,
    });
    return res.data;
  },

  // add: async (data: {
  //   rank_name: string;
  //   rank_level: number;
  //   min_spending: number;
  //   discount_rate: number;
  //   description: string;
  // }) => {
  //   const res = await api.post("/customer-ranks", data, {
  //     withCredentials: true,
  //   });
  //   return res.data;
  // },

  // update: async (id: string, data: Partial<CustomerRank>) => {
  //   const res = await api.put(`/customer-ranks/${id}`, data, {
  //     withCredentials: true,
  //   });
  //   return res.data;
  // },

  // delete: async (id: string) => {
  //   const res = await api.delete(`/customer-ranks/${id}`, {
  //     withCredentials: true,
  //   });
  //   return res.data;
  // },

  // getById: async (id: string) => {
  //   const res = await api.get(`/customer-ranks/${id}`, {
  //     withCredentials: true,
  //   });
  //   return res.data;
  // },
};
