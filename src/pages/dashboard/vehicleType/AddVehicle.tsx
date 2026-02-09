import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVehicleTypeStore } from '@/store/useVehicleType';
import React from 'react'

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
const vehicleFormSchema = z.object({
  vehicle_type_name: z.string().min(1, "Tên loại xe là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
});
type VehicleFormValue = z.infer<typeof vehicleFormSchema>;


const AddVehicle = () => {
  const [open, setOpen] = React.useState(false);
  const addViewType = useVehicleTypeStore((state) => state.addVehicleType);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleFormValue>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vehicle_type_name: "",
      description: "",
    },
  });

  const onSubmit = async (data: any) => {
    await addViewType(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Thêm loại xe</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-10">
            <DialogHeader>
              <DialogTitle>Thêm loại xe </DialogTitle>
            </DialogHeader>
          </div>

          <FieldGroup>
            <Field>
              <Label>Tên loại xe</Label>
              <Input {...register("vehicle_type_name")} />
              {errors.vehicle_type_name && (
                <p className="text-red-500 text-sm">
                  {errors.vehicle_type_name.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Mô tả</Label>
              <Input {...register("description")} />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
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
}

export default AddVehicle
