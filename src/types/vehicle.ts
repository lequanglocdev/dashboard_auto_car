export default interface Vehicle {
  _id: string;
  customer_id: string;
  vehicle_type_id: {
    _id: string;
    vehicle_type_name: string;
    
  };
  license_plate: string;
  manufacturer: string;
  model: string;
  year: number;
  color: string;
  created_at?: string;
  is_deleted?: boolean;
}

export type CreateVehicle = {
  vehicle_type_id: string;
  license_plate: string;
  manufacturer: string;
  model: string;
  year: number;
  color: string;
};
