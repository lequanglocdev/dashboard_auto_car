// types/promotion.ts

export interface BaseEntity {
  _id: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

/* ================= HEADER ================= */

export interface PromotionHeader extends BaseEntity {
  promotion_code: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}

export type CreatePromotionHeader = {
  promotion_code: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
};

export type UpdatePromotionHeader = Partial<Omit<PromotionHeader, "_id">>;

/* ================= LINE ================= */

export type DiscountType = "percentage" | "fixed";

export interface PromotionLine extends BaseEntity {
  promotion_header_id: string;
  discount_type: DiscountType;
  description?: string;
  start_date: string;
  end_date: string;
}

export type CreatePromotionLine = {
  discount_type: DiscountType;
  description?: string;
  start_date: string;
  end_date: string;
};

export type UpdatePromotionLine = Partial<
  Omit<PromotionLine, "_id" | "promotion_header_id">
>;

/* ================= DETAIL ================= */

export interface PopulatedRank {
  _id: string;
  rank_name: string;
}

export interface PopulatedService {
  _id: string;
  service_name: string;
}

export interface PromotionDetail extends BaseEntity {
  promotion_line_id: string;
  applicable_rank_id?: PopulatedRank;
  service_id?: PopulatedService;
  discount_value: number;
  min_order_value: number;
}

export type CreatePromotionDetail = {
  applicable_rank_id?: string;
  service_id?: string;
  discount_value: number;
  min_order_value: number;
};

export type UpdatePromotionDetail = Partial<
  Omit<PromotionDetail, "_id" | "promotion_line_id">
>;
