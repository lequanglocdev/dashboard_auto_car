import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import type { PriceHeader } from "@/types/price";
import { usePriceStore } from "@/store/usePriceStore";

type EditPriceHeaderProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  priceHeader: PriceHeader | null;
};

export const EditPriceHeader = ({
  open,
  setOpen,
  priceHeader,
}: EditPriceHeaderProps) => {
  const updatePriceHeader = usePriceStore((state) => state.updatePriceHeader);

  const [form, setForm] = useState({
    price_list_name: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (priceHeader) {
      setForm({
        price_list_name: priceHeader.price_list_name,
        start_date: priceHeader.start_date
          ? new Date(priceHeader.start_date).toISOString().split("T")[0]
          : "",
        end_date: priceHeader.end_date
          ? new Date(priceHeader.end_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [priceHeader]);

  const handleSubmit = async () => {
    if (priceHeader) {
      await updatePriceHeader(priceHeader._id, form);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật bảng giá</DialogTitle>
        </DialogHeader>

        <Input
          value={form.price_list_name}
          onChange={(e) =>
            setForm({ ...form, price_list_name: e.target.value })
          }
          placeholder="Tên bảng giá"
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

        <Button variant={"destructive"} onClick={handleSubmit}>
          Lưu
        </Button>
      </DialogContent>
    </Dialog>
  );
};
