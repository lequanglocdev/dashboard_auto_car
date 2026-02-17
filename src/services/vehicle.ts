import api from "@/lib/axios";
import type { CreateVehicle } from "@/types/vehicle";

export const vehicleService = {
  add: async (customerId: string, vehicleData: CreateVehicle) => {
    const res = await api.post(`/vehicles/${customerId}`, vehicleData);
    return res.data;
  },

  update: async (
    customerId: string,
    vehicleId: string,
    vehicleData: Partial<CreateVehicle>
  ) => {
    const res = await api.put(
      `/vehicles/${customerId}/${vehicleId}`,
      vehicleData
    );
    return res.data;
  },

  delete: async (customerId: string, vehicleId: string) => {
    const res = await api.delete(`/vehicles/${customerId}/${vehicleId}`);
    return res.data;
  },
};
