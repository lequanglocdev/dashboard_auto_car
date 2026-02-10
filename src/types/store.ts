import type  Customer  from "./customer";
import type Service from "./service";
import type User from "./user";
import type VehicleType from "./vehicle-type";


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
}

export interface VehicleTypeState {
  vehicleTypes: VehicleType[];
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  error: string | null;
  fetchVehicleTypes: (page?: number, limit?: number) => Promise<void>;
  addVehicleType: (vehicleTypeData: {  vehicle_type_name: string; description?: string }) => Promise<void>;
  updateVehicleType: (id: string, vehicleTypeData: Partial<any>) => Promise<void>;
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
  addService:(serviceData: { service_code: string; name: string; description: string; time_required: number }) => Promise<void>;
  updateService: (id: string, serviceData: Partial<Omit<Service, "_id" | "created_at" | "updated_at" | "is_deleted">>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
}
