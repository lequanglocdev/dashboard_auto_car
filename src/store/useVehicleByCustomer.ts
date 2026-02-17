
import { vehicleService } from "@/services/vehicle";
import type { VehicleCustomerState } from "@/types/store";

import { toast } from "sonner";
import { create } from "zustand";

export const useVehicleByCustomerStore = create<VehicleCustomerState>(
  (set) => ({
    vehicle: [],
    loading: false,

    setVehicles: (vehicles) => set({ vehicle: vehicles }),

    addVehicleByCustomerId: async (customerId, data) => {
      try {
        const res = await vehicleService.add(customerId, data);

        set((state) => ({
          vehicle: [res.vehicle, ...state.vehicle],
        }));

        toast.success("Thêm xe thành công");
      } catch (error) {
        console.error(error);
      }
    },

    updateVehicleByCustomerId: async (customerId, vehicleId, data) => {
      try {
        const res = await vehicleService.update(customerId, vehicleId, data);

        set((state) => ({
          vehicle: state.vehicle.map((v) =>
            v._id === vehicleId ? res.vehicle : v
          ),
        }));

        toast.success("Cập nhật xe thành công");
      } catch (error) {
        console.error(error);
      }
    },

    deleteVehicleByCustomerId: async (customerId, vehicleId) => {
      try {
        await vehicleService.delete(customerId, vehicleId);

        set((state) => ({
          vehicle: state.vehicle.filter((v) => v._id !== vehicleId),
        }));

        toast.success("Xóa xe thành công");
      } catch (error) {
        console.error(error);
      }
    },
  })
);
