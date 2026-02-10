export default interface Service {
  _id: string;
  service_code: string;
  name: string;
  description: string;
  time_required: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
