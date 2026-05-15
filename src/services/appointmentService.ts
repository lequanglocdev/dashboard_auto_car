import api from "@/lib/axios";
import type { Appointment, AppointmentFormData } from "@/types/appointment";

export const appointmentService = {
  search: async (params?: {
    date?: string;
    status?: string;
    license_plate?: string;
    customer_name?: string;
    phone_number?: string;
  }): Promise<Appointment[]> => {
    const res = await api.get("/appointments/search", {
      params,
      withCredentials: true,
    });
    return res.data;
  },

  getById: async (appointmentId: string): Promise<Appointment> => {
    const res = await api.get(`/appointments/${appointmentId}`, {
      withCredentials: true,
    });
    return res.data;
  },

  create: async (data: AppointmentFormData): Promise<Appointment> => {
    const res = await api.post("/appointments", data, {
      withCredentials: true,
    });
    return res.data;
  },

  cancel: async (appointmentId: string): Promise<void> => {
    await api.delete(`/appointments/${appointmentId}`, {
      withCredentials: true,
    });
  },

  arrive: async (appointmentId: string): Promise<Appointment> => {
    const res = await api.post(
      `/appointments/${appointmentId}/arrive`,
      {},
      { withCredentials: true }
    );
    return res.data;
  },

  complete: async (appointmentId: string): Promise<Appointment> => {
    const res = await api.post(
      `/appointments/${appointmentId}/complete`,
      {},
      { withCredentials: true }
    );
    return res.data;
  },

  toggleService: async (appointmentServiceId: string): Promise<void> => {
    await api.put(
      `/appointments/service/${appointmentServiceId}`,
      {},
      { withCredentials: true }
    );
  },

  getByCustomer: async (customerId: string): Promise<Appointment[]> => {
    const res = await api.get(`/appointments/mobile/customer/${customerId}`, {
      withCredentials: true,
    });
    return res.data;
  },
};
