import type { VehicleTypeState } from "@/types/store";
import type VehicleType from "@/types/vehicle-type";
import { vehicleTypeService } from "@/services/vehicleType";
import { toast } from "sonner";
import { create } from "zustand";

export const useVehicleTypeStore = create<VehicleTypeState>((set) => ({
  vehicleTypes: [],
  loading: false,
  total: 0,
  page: 1,
  limit: 10,
  error: null,

  fetchVehicleTypes: async (page = 1, limit = 10) => {
    try {
      set({ loading: true });
      const res = await vehicleTypeService.getAll(page, limit);
      set({
        vehicleTypes: res.vehicleTypes || [],
        total: res.total || 0,
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
  addVehicleType: async (vehicleTypeData) => {
    try {
      const res = await vehicleTypeService.add(vehicleTypeData);
      console.log("log:", res);
      const newVehicleType = res.vehicleType;
      const mapped: VehicleType = {
        _id: newVehicleType.id ?? newVehicleType._id,
        vehicle_type_name: newVehicleType.vehicle_type_name,
        description: newVehicleType.description,
      };
      set((state) => ({
        vehicleTypes: [mapped, ...state.vehicleTypes],
        total: state.total + 1,
      }));
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  },

  updateVehicleType: async (id, vehicleTypeData) => {
    try {
      const res = await vehicleTypeService.update(id, vehicleTypeData);
      set((state) => ({
        vehicleTypes: state.vehicleTypes.map((vt) =>
          vt._id === id ? { ...vt, ...res.vehicleType } : vt
        ),
      }));
      toast.success("Cập nhật loại xe thành công");
    } catch (error) {
      toast.error("Cập nhật loại xe thất bại");
      throw error;
    }
  },

  deleteVehicleType: async (id) => {
    try {
      await vehicleTypeService.delete(id);
      set((state) => ({
        vehicleTypes: state.vehicleTypes.filter((vt) => vt._id !== id),
        total: state.total - 1,
      }));
      toast.success("Xóa loại xe thành công");
    } catch (error) {
      toast.error("Xóa loại xe thất bại");
      throw error;
    }
  },
}));
