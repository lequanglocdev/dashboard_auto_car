import type  Customer  from "./customer";
import type User from "./user";


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
