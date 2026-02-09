import api from "@/lib/axios";
import type VehicleType from "@/types/vehicle-type";

export const vehicleTypeService = {
  getAll: async (page: number, limit: number) => {
    const res = await api.get("/vehicle-types", {
      params: { page, limit },
      withCredentials: true,
    });
    return res.data;
  },
  add: async (vehicleTypeData: { vehicle_type_name: string; description?: string }) => {
    const res = await api.post("/vehicle-types", vehicleTypeData, { 
      withCredentials: true,
    });
    return res.data;
  },
  update: async (id: string, data: Partial<VehicleType>) => {
    const res = await api.put(`/vehicle-types/${id}`, data, {
      withCredentials: true,
    });
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/vehicle-types/${id}`, { withCredentials: true });
    return res.data;
  },
};
