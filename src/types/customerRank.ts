export default interface CustomerRank {
  _id: string;
  rank_name: string;
  rank_level: number;
  min_spending: number;
  discount_rate: number;
  description: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
