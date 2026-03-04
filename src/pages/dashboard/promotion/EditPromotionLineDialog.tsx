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
import type { PromotionLine, DiscountType } from "@/types/promotion";

interface EditPromotionLineProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  line: PromotionLine | null;
}

export const EditPromotionLineDialog = ({
  open,
  setOpen,
  line,
}: EditPromotionLineProps) => {
  const updatePromotionLine = usePromotionStore(
    (state) => state.updatePromotionLine
  );

  const [form, setForm] = useState<{
    discount_type: DiscountType;
    description: string;
  }>({
    description: "",
    discount_type: "percentage",
  });

  useEffect(() => {
    if (line) {
      setForm({
        description: line.description ?? "",
        discount_type: line.discount_type ?? "percentage",
      });
    }
  }, [line]);

  const handleSubmit = async () => {
    if (!line) return;

    await updatePromotionLine(line._id, form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật dòng khuyến mãi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Discount Type */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Loại giảm giá
            </label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={form.discount_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  discount_type: e.target.value as DiscountType,
                })
              }>
              <option value="percentage">Phần trăm (%)</option>
              <option value="fixed">Số tiền cố định</option>
            </select>
          </div>

          {/* Description */}
          <Input
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Button onClick={handleSubmit} className="w-full">
            Cập nhật
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
