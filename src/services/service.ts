import api from "@/lib/axios";
import type Service from "@/types/service";

export const serveiceService = {
  get : async (page: number, limit: number) => {
    // Implementation for fetching services
    const res = await api.get("/services", {
      params: { page, limit },
      withCredentials: true,
    });
    return res.data;
  },
  add: async (serviceData: { service_code: string; name: string; description: string; time_required: number }) => {
    const res = await api.post("/services", serviceData, {
      withCredentials: true,
    });
    return res.data;
  },
  update: async (id: string, data: Partial<Omit<Service, "_id" | "created_at" | "updated_at" | "is_deleted">>) => {
    const res = await api.put(`/services/${id}`, data, {
      withCredentials: true,
    });
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/services/${id}`, { withCredentials: true });
    return res.data;
  },  

}
