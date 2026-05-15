import type Customer from "./customer";
import type CustomerRank from "./customerRank";
import type { CreatePriceLine, PriceHeader, PriceLine } from "./price";
import type { CreatePromotionDetail, CreatePromotionHeader, CreatePromotionLine, PromotionDetail, PromotionHeader, PromotionLine, UpdatePromotionDetail, UpdatePromotionHeader, UpdatePromotionLine } from "./promotion";
import type Service from "./service";
import type User from "./user";
import type { CreateVehicle } from "./vehicle";
import type Vehicle from "./vehicle";
import type VehicleType from "./vehicle-type";
import type Slot from "./slot";
import type { Appointment, AppointmentFormData } from "./appointment";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  setAccessToken: (accessToken: string) => void;
  clearState: () => void;
  setUser: (user: User | null) => void;

  signUp: (email: string, username: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
}

export interface CustomerState {
  customers: Customer[];
  customerRanks: CustomerRank[];
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  error: string | null;

  fetchCustomers: (page?: number, limit?: number) => Promise<void>;

  addCustomer: (customerData: Omit<Customer, "_id">) => Promise<void>;

  updateCustomer: (
    _id: string,
    customerData: Partial<Omit<Customer, "_id">>
  ) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getCustomerById: (id: any) => Promise<any>;
  getCustomerByIdWithVehicles: (id: any) => Promise<any>;
  fetchCustomerRank: (page?: number, litmit?: number) => Promise<void>;
  findByContact: (
    query: string
  ) => Promise<{ customer: Customer; vehicles: Vehicle[] }>;
}

export interface VehicleTypeState {
  vehicleTypes: VehicleType[];
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  error: string | null;
  fetchVehicleTypes: (page?: number, limit?: number) => Promise<void>;
  addVehicleType: (vehicleTypeData: {
    vehicle_type_name: string;
    description?: string;
  }) => Promise<void>;
  updateVehicleType: (
    id: string,
    vehicleTypeData: Partial<any>
  ) => Promise<void>;
  deleteVehicleType: (id: string) => Promise<void>;
}

export interface ServicesState {
  services: Service[];
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  error: string | null;
  fetchServices: (page?: number, limit?: number) => Promise<void>;
  addService: (serviceData: {
    service_code: string;
    name: string;
    description: string;
    time_required: number;
  }) => Promise<void>;
  updateService: (
    id: string,
    serviceData: Partial<
      Omit<Service, "_id" | "created_at" | "updated_at" | "is_deleted">
    >
  ) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}

export interface VehicleCustomerState {
  vehicle: Vehicle[];
  loading: boolean;
  setVehicles: (vehicles: Vehicle[]) => void;

  addVehicleByCustomerId: (
    customerId: string,
    data: CreateVehicle
  ) => Promise<void>;

  updateVehicleByCustomerId: (
    customerId: string,
    vehicleId: string,
    data: Partial<CreateVehicle>
  ) => Promise<void>;
  deleteVehicleByCustomerId: (
    customerId: string,
    vehicleId: string
  ) => Promise<void>;
}


export interface PriceState {
  priceHeaders: PriceHeader[];
  priceLines: PriceLine[];
  loading: boolean;
  error: string | null;

  fetchPriceHeaders: () => Promise<void>;
  addPriceHeader: (data: Omit<PriceHeader, "_id">) => Promise<void>;
  updatePriceHeader: (
    id: string,
    data: Partial<Omit<PriceHeader, "_id">>
  ) => Promise<void>;
  deletePriceHeader: (id: string) => Promise<void>;

  fetchPriceLines: (priceHeaderId: string) => Promise<void>;
  addPriceLine: (
    priceHeaderId: string,
    data: Partial<CreatePriceLine>
  ) => Promise<void>;
  updatePriceLine: (
    id: string,
    data: Partial<Omit<PriceLine, "_id">>
  ) => Promise<void>;
  deletePriceLine: (id: string) => Promise<void>;
  togglePriceLine: (id: string) => Promise<void>;
  togglePriceHead: (id: string) => Promise<void>;
  fetchPriceLinesByVehicleType: (vehicleTypeId: string) => Promise<void>;
}

export interface PromotionState {
  promotionHeaders: PromotionHeader[];
  promotionLines: PromotionLine[];
  promotionDetails: PromotionDetail[];
  loading: boolean;
  error: string | null;

  // HEADER
  fetchPromotionHeaders: () => Promise<void>;
  addPromotionHeader: (data: CreatePromotionHeader) => Promise<void>;
  updatePromotionHeader: (
    id: string,
    data: UpdatePromotionHeader
  ) => Promise<void>;
  deletePromotionHeader: (id: string) => Promise<void>;

  // LINE
  fetchPromotionLines: (promotionHeaderId: string) => Promise<void>;
  addPromotionLine: (
    promotionHeaderId: string,
    data: CreatePromotionLine
  ) => Promise<void>;
  updatePromotionLine: (id: string, data: UpdatePromotionLine) => Promise<void>;
  deletePromotionLine: (id: string) => Promise<void>;

  // DETAIL
  fetchPromotionDetails: (promotionLineId: string) => Promise<void>;
  addPromotionDetail: (
    promotionLineId: string,
    data: CreatePromotionDetail
  ) => Promise<void>;
  updatePromotionDetail: (
    id: string,
    data: UpdatePromotionDetail
  ) => Promise<void>;
  deletePromotionDetail: (id: string) => Promise<void>;
  togglePromotionHead: (id: string) => Promise<void>;
  togglePromotionLine: (id: string) => Promise<void>;
  togglePromotionDetail: (id: string) => Promise<void>;
}

export interface SlotsState {
  slots: Slot[];
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  error: string | null;
  fetchSlots: (page?: number, limit?: number) => Promise<void>;
  addSlot: (slotData: {
    start_time: string;
    capacity?: number;
  }) => Promise<void>;
  updateSlot: (
    id: string,
    slotData: Partial<
      Omit<Slot, "_id" | "created_at" | "updated_at" | "is_deleted">
    >
  ) => Promise<void>;
  deleteSlot: (id: string) => Promise<void>;
}

// types/store.ts — thêm vào cuối
export interface AppointmentsState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  preselectedSlotId: string | null;
  isModalOpen: boolean;
  isLoading: boolean;
  error: string | null;

  fetchAppointments: (params?: {
    date?: string;
    status?: string;
    license_plate?: string;
    customer_name?: string;
    phone_number?: string;
  }) => Promise<void>;
  getAppointmentById: (id: string) => Promise<void>;
  createAppointment: (data: AppointmentFormData) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  arriveAppointment: (id: string) => Promise<void>;
  completeAppointment: (id: string) => Promise<void>;
  toggleServiceDone: (appointmentServiceId: string) => Promise<void>;

  openModal: (appointment?: Appointment, slotId?: string) => void;
  closeModal: () => void;
}
