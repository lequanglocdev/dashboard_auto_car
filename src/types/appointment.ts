export type AppointmentStatus = 'scheduled' | 'waiting' | 'in_progress' | 'completed' | 'cancelled';

export interface AppointmentService {
  _id: string;
  appServiceId: string;
  name: string;
  description?: string;
  price: number;
  time_required: number;
  is_done: boolean;
  time_completed?: string;
}

export interface Appointment {
  _id: string;
  customer_id: string;
  vehicle_id: string;
  slot_id: string | null;
  appointment_datetime: string;
  status: AppointmentStatus;
  is_deleted: boolean;
  services?: AppointmentService[];
  total_cost?: number;
  total_time?: number;
  created_at: string;
  updated_at: string;
}

export interface AppointmentFormData {
  slot_id: string;
  vehicle_id: string;
  service_ids: string[];           // service_id list — backend tự tìm priceLine
  appointment_datetime: string;
}

export interface CreateAppointmentResponse {
  appointment: Appointment;
  slot: {
    _id: string;
    start_time: string;
    status: string;
  };
  total_time: number;
}
