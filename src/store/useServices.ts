import { serveiceService } from "@/services/service";
import type Service from "@/types/service";
import type { ServicesState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";

export const useServicesStore = create<ServicesState>((set) => ({
  services: [],
  loading: false,
  total: 0,
  page: 1,
  limit: 10,
  error: null,
  fetchServices: async (page = 1, limit = 10) => {
    try {
      set({ loading: true });
      const data = await serveiceService.get(page, limit);
      set({
        services: data.services || [],
        total: data.total || 0,
        page,
        limit,
        loading: false,
      });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
  addService: async (serviceData) => {
    try {
      const res = await serveiceService.add(serviceData);
      console.log(res);
      const newService = res;
      const mapped: Service = {
        _id: newService._id ?? newService._id,
        service_code: newService.service_code,
        name: newService.name,
        description: newService.description,
        time_required: newService.time_required,
        is_deleted: newService.is_deleted,
        created_at: newService.created_at,
        updated_at: newService.updated_at,
      };
      set((state) => ({
        services: [mapped, ...state.services],
        total: state.total + 1,
      }));
      toast.success("Thêm dịch vụ thành công");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      throw error;
    }
  },
  updateService: async (id, serviceData) => {
    const res = await serveiceService.update(id, serviceData);
    const updatedService = res.data;

    set((state) => ({
      services: state.services.map((s) => (s._id === id ? updatedService : s)),
    }));

    toast.success("Cập nhật dịch vụ thành công");
  },
  deleteService: async (id) => {
    try {
      await serveiceService.delete(id);
      set((state) => ({
        services: state.services.filter((s) => s._id !== id),
        total: state.total - 1,
      }));
      toast.success("Xóa dịch vụ thành công");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      throw error;
    }
  },
}));
