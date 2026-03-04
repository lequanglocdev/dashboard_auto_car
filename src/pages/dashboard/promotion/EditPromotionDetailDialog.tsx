import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePromotionStore } from "@/store/usePromotionStore";
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

  const [form, setForm] = useState({
    applicable_rank_id: "",
    discount_value: 0,
    min_order_value: 0,
  });

  useEffect(() => {
    if (detail) {
      setForm({
        applicable_rank_id: detail.applicable_rank_id?._id ?? "",
        discount_value: detail.discount_value,
        min_order_value: detail.min_order_value,
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
          <Input
            placeholder="Rank ID"
            value={form.applicable_rank_id}
            onChange={(e) =>
              setForm({ ...form, applicable_rank_id: e.target.value })
            }
          />

        
          <Input
            type="number"
            placeholder="Giá trị giảm"
            value={form.discount_value}
            onChange={(e) =>
              setForm({ ...form, discount_value: Number(e.target.value) })
            }
          />

          <Input
            type="number"
            placeholder="Giá trị đơn tối thiểu"
            value={form.min_order_value}
            onChange={(e) =>
              setForm({ ...form, min_order_value: Number(e.target.value) })
            }
          />

          <Button onClick={handleSubmit} className="w-full">
            Cập nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
