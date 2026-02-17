import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useVehicleByCustomerStore } from "@/store/useVehicleByCustomer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useVehicleTypeStore } from "@/store/useVehicleType";

const customerByIdWithVehicles = z.object({
  vehicle_type_id: z.string().min(1, "Loại xe là bắt buộc"),
  license_plate: z.string().min(1, "Biển số xe là bắt buộc"),
  manufacturer: z.string().min(1, "Hãng xe là bắt buộc"),
  model: z.string().min(1, "Mẫu xe là bắt buộc"),
  year: z.number().min(1886, "Năm sản xuất không hợp lệ"),
  color: z.string().min(1, "Màu sắc là bắt buộc"),
});

type VehicleFormValues = z.infer<typeof customerByIdWithVehicles>;

type Props = {
  customerId: string;
};

const AddVehicleCustomer = ({ customerId }: Props) => {
  const [open, setOpen] = React.useState(false);
  const addVehicleCustomer = useVehicleByCustomerStore(
    (state) => state.addVehicleByCustomerId
  );
  const vehicleTypes = useVehicleTypeStore((state) => state.vehicleTypes);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(customerByIdWithVehicles),
    defaultValues: {
      vehicle_type_id: "",
      license_plate: "",
      manufacturer: "",
      model: "",
      year: undefined,
      color: "",
    },
  });
  const onSubmit = async (data: VehicleFormValues) => {
    await addVehicleCustomer(customerId, data);
    reset();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Thêm xe </Button>
      </DialogTrigger>

      <DialogContent className=" sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-10">
            <DialogHeader>
              <DialogTitle>Thêm xe</DialogTitle>
            </DialogHeader>
          </div>

          <FieldGroup>
            <Field>
              <Label>Loại xe</Label>

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

              {errors.vehicle_type_id && (
                <p className="text-red-500 text-sm">
                  {errors.vehicle_type_id.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Biển số xe</Label>
              <Input {...register("license_plate")} />
              {errors.license_plate && (
                <p className="text-red-500 text-sm">
                  {errors.license_plate.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Hãng xe</Label>
              <Input {...register("manufacturer")} />
              {errors.manufacturer && (
                <p className="text-red-500 text-sm">
                  {errors.manufacturer.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Mẫu xe</Label>
              <Input {...register("model")} />
              {errors.model && (
                <p className="text-red-500 text-sm">{errors.model.message}</p>
              )}
            </Field>

            <Field>
              <Label>Năm sản xuất</Label>
              <Input {...register("year", { valueAsNumber: true })} />
              {errors.year && (
                <p className="text-red-500 text-sm">{errors.year.message}</p>
              )}
            </Field>

            <Field>
              <Label>Màu sắc</Label>
              <Input {...register("color")} />
              {errors.color && (
                <p className="text-red-500 text-sm">{errors.color.message}</p>
              )}
            </Field>
          </FieldGroup>

          <div className="mt-4">
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </DialogClose>

              <Button type="submit" variant="destructive">
                Lưu
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleCustomer;
