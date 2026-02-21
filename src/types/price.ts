export interface PriceHeader {
  _id: string;
  price_list_name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_deleted?: boolean;
  updated_at?: string;
}

export interface PriceLine {
  _id: string;
  price_header_id: string;
  service_id: any; // vì backend populate
  vehicle_type_id: any; // vì backend populate
  price: number;
  is_active?: boolean;
  is_deleted?: boolean;
  updated_at?: string;
}

export type CreatePriceLine = {
  service_id: any; // vì backend populate
  vehicle_type_id: any; // vì backend populate
  price: number;
  is_active: boolean;
  is_deleted?: boolean;
};
