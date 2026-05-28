import { create } from "zustand";
import { toast } from "sonner";
import { appointmentService } from "@/services/appointmentService";
import type { AppointmentsState } from "@/types/store";
export const useAppointmentStore = create<AppointmentsState>((set) => ({
  appointments: [],
  selectedAppointment: null,
  preselectedSlotId: null,
  isModalOpen: false,
  isLoading: false,
  error: null,

  fetchAppointments: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await appointmentService.search(params);
      set({ appointments: data });
    } catch (e: any) {
      set({ error: e.message });
      toast.error(e.message);
    } finally {
      set({ isLoading: false });
    }
  },

  getAppointmentById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await appointmentService.getById(id);
      set({ selectedAppointment: data });
    } catch (e: any) {
      set({ error: e.message });
      toast.error(e.message);
    } finally {
      set({ isLoading: false });
    }
  },

  createAppointment: async (data) => {
    set({ isLoading: true, error: null });
     try {
       const created = await appointmentService.create(data);
       set((s) => ({ appointments: [created.appointment, ...s.appointments] }));
       toast.success("Đặt lịch thành công!");
       return created; // ← thêm return
     } catch (e: any) {
       set({ error: e.message });
       toast.error(e.message);
       throw e;
     } finally {
       set({ isLoading: false });
     }
  },

  cancelAppointment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentService.cancel(id);
      set((s) => ({
        appointments: s.appointments.filter((a) => a._id !== id),
      }));
      toast.success("Đã huỷ lịch hẹn");
    } catch (e: any) {
      set({ error: e.message });
      toast.error(e.message);
    } finally {
      set({ isLoading: false });
    }
  },

  arriveAppointment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await appointmentService.arrive(id);
      set((s) => ({
        appointments: s.appointments.map((a) => (a._id === id ? updated : a)),
        selectedAppointment: updated,
      }));
      toast.success("Xe đã vào gara");
    } catch (e: any) {
      set({ error: e.message });
      toast.error(e.message);
    } finally {
      set({ isLoading: false });
    }
  },

  completeAppointment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await appointmentService.complete(id);
      set((s) => ({
        appointments: s.appointments.map((a) => (a._id === id ? updated : a)),
        selectedAppointment: updated,
      }));
      toast.success("Hoàn thành dịch vụ!");
    } catch (e: any) {
      set({ error: e.message });
      toast.error(e.message);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleServiceDone: async (appointmentServiceId) => {
    set({ isLoading: true, error: null });
    try {
      await appointmentService.toggleService(appointmentServiceId);
    } catch (e: any) {
      set({ error: e.message });
      toast.error(e.message);
    } finally {
      set({ isLoading: false });
    }
  },

  openModal: (appointment, slotId) =>
    set({
      isModalOpen: true,
      selectedAppointment: appointment ?? null,
      preselectedSlotId: slotId ?? null,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      selectedAppointment: null,
      preselectedSlotId: null,
    }),
}));
