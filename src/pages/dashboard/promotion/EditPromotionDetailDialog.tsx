import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePromotionStore } from "@/store/usePromotionStore";
import { useCustomerStore } from "@/store/useCustomerStore";
import { useServicesStore } from "@/store/useServices";
import type { PromotionDetail } from "@/types/promotion";

interface EditPromotionDetailProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  detail: PromotionDetail | null;
}

export const EditPromotionDetailDialog = ({
  open,
  setOpen,
  detail,
}: EditPromotionDetailProps) => {
  const updatePromotionDetail = usePromotionStore(
    (state) => state.updatePromotionDetail
  );

  const { customerRanks, fetchCustomerRank } = useCustomerStore();
  const { services, fetchServices } = useServicesStore();

  const [form, setForm] = useState({
    applicable_rank_id: "",
    service_id: "",
    discount_value: 0,
    min_order_value: 0,
  });

  useEffect(() => {
    fetchCustomerRank();
    fetchServices();
  }, []);

  useEffect(() => {
    if (detail) {
      setForm({
        applicable_rank_id: detail.applicable_rank_id?._id ?? "",
        service_id: detail.service_id?._id ?? "",
        discount_value: detail.discount_value ?? 0,
        min_order_value: detail.min_order_value ?? 0,
      });
    }
  }, [detail]);

  const handleSubmit = async () => {
    if (!detail) return;

    await updatePromotionDetail(detail._id, form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật chi tiết khuyến mãi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rank */}
          <div>
            <label className="block mb-1 text-sm font-medium">Chọn Rank</label>
            <select
              className="w-full border rounded px-2 py-2"
              value={form.applicable_rank_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  applicable_rank_id: e.target.value,
                })
              }>
              <option value="">-- Chọn rank --</option>
              {customerRanks.map((rank) => (
                <option key={rank._id} value={rank._id}>
                  {rank.rank_name}
                </option>
              ))}
            </select>
          </div>

          {/* Service */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Chọn dịch vụ
            </label>
            <select
              className="w-full border rounded px-2 py-2"
              value={form.service_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  service_id: e.target.value,
                })
              }>
              <option value="">-- Chọn dịch vụ --</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {/* Discount Value */}
          <Input
            type="number"
            placeholder="Giá trị giảm"
            value={form.discount_value}
            onChange={(e) =>
              setForm({
                ...form,
                discount_value: Number(e.target.value),
              })
            }
          />

          {/* Min Order Value */}
          <Input
            type="number"
            placeholder="Số tiền tối thiểu"
            value={form.min_order_value}
            onChange={(e) =>
              setForm({
                ...form,
                min_order_value: Number(e.target.value),
              })
            }
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit}>Cập nhật</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
