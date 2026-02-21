import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePriceStore } from "@/store/usePriceStore";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVehicleTypeStore } from "@/store/useVehicleType";
import { useServicesStore } from "@/store/useServices";

const schema = z.object({
  service_id: z.string().min(1, "Service là bắt buộc"),
  vehicle_type_id: z.string().min(1, "Loại xe là bắt buộc"),
  price: z.number().min(0, "Giá phải >= 0"),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  headerId: string;
};

export const AddPriceLineDialog = ({ headerId }: Props) => {
  const addPriceLine = usePriceStore((state) => state.addPriceLine);
  const [open, setOpen] = useState(false);

  const vehicleTypes = useVehicleTypeStore((state) => state.vehicleTypes);
  const service = useServicesStore((state) => state.services);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    await addPriceLine(headerId, { ...data, is_active: true });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button onClick={(e) => e.stopPropagation()} className="text-green-500">
          Thêm
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Thêm dòng giá</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label className="py-4">Dịch vụ</Label>
              <select
                {...register("service_id")}
                className="w-full border rounded-md h-9 px-3 bg-background">
                <option value="">-- Chọn dịch vụ --</option>
                {service.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="py-4">Loại xe</Label>
              <select
                {...register("vehicle_type_id")}
                className="w-full border rounded-md h-9 px-3 bg-background">
                <option value="">-- Chọn loại xe --</option>
                {vehicleTypes.map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.vehicle_type_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="py-4">Giá</Label>
              <Input
                type="number"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </DialogClose>

            <Button variant="destructive" type="submit">
              Lưu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
