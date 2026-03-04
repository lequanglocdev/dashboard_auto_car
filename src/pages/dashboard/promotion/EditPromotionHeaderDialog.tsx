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
import type { PromotionHeader } from "@/types/promotion";

interface EditPromotionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  header: PromotionHeader | null;
}

export const EditPromotionHeaderDialog = ({
  open,
  setOpen,
  header,
}: EditPromotionProps) => {
  const updatePromotionHeader = usePromotionStore(
    (state) => state.updatePromotionHeader
  );

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    is_active: false,
  });

  useEffect(() => {
    if (header) {
      setForm({
        name: header.name,
        description: header.description ?? "",
        start_date: header.start_date
          ? new Date(header.start_date).toISOString().split("T")[0]
          : "",
        end_date: header.end_date
          ? new Date(header.end_date).toISOString().split("T")[0]
          : "",
        is_active: header.is_active ?? false,
      });
    }
  }, [header]);

  const handleSubmit = async () => {
    if (header) {
      await updatePromotionHeader(header._id, form);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật khuyến mãi</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Tên khuyến mãi"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <Input
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          placeholder="Ngày bắt đầu"
        />

        <Input
          type="date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          placeholder="Ngày kết thúc"
        />
        <Button onClick={handleSubmit} className="w-full">
          Cập nhật
        </Button>
      </DialogContent>
    </Dialog>
  );
};
