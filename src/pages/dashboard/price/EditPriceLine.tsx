import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import type { PriceLine } from "@/types/price";
import { useServicesStore } from "@/store/useServices";
import { useVehicleTypeStore } from "@/store/useVehicleType";
import { usePriceStore } from "@/store/usePriceStore";

type EditPriceLineProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  priceLine: PriceLine | null;
};

export const EditPriceLine = ({
  open,
  setOpen,
  priceLine,
}: EditPriceLineProps) => {
  const updatePriceLine = usePriceStore((state) => state.updatePriceLine);
  const services = useServicesStore((state) => state.services)
 const vehicleTypes = useVehicleTypeStore((state) => state.vehicleTypes);

  const [form, setForm] = useState({
    service_id: "",
    vehicle_type_id: "",
    price: "",
  });

  useEffect(() => {
    if (priceLine) {
      setForm({
        service_id:
          typeof priceLine.service_id === "object"
            ? priceLine.service_id._id
            : priceLine.service_id,
        vehicle_type_id:
          typeof priceLine.vehicle_type_id === "object"
            ? priceLine.vehicle_type_id._id
            : priceLine.vehicle_type_id,
        price: String(priceLine.price),
      });
    }
  }, [priceLine]);


  const handleSubmit = async () => {
    if (priceLine) {
      const updatedPriceLine = {
        ...priceLine,
        service_id: form.service_id,
        vehicle_type_id: form.vehicle_type_id,
        price: Number(form.price),
      };
      await updatePriceLine(priceLine._id, updatedPriceLine as any);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật dòng bảng giá</DialogTitle>
        </DialogHeader>

        <select
          className="w-full border rounded-md px-3 py-2"
          value={form.service_id}
          onChange={(e) =>
            setForm({
              ...form,
              service_id: e.target.value,
            })
          }>
          {services.map((type) => (
            <option key={type._id} value={type._id}>
              {type.name}
            </option>
          ))}
        </select>

        <select
          className="w-full border rounded-md px-3 py-2"
          value={form.vehicle_type_id}
          onChange={(e) =>
            setForm({
              ...form,
              vehicle_type_id: e.target.value,
            })
          }>
          {vehicleTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.vehicle_type_name}
            </option>
          ))}
        </select>

        <Input
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="SĐT"
        />

        <Button variant={"destructive"} onClick={handleSubmit}>
          Lưu
        </Button>
      </DialogContent>
    </Dialog>
  );
};
