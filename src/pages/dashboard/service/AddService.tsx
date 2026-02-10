
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServicesStore } from "@/store/useServices";

const serviceFormSchema = z.object({
  service_code: z.string().min(1, "Mã dịch vụ là bắt buộc"),
  name: z.string().min(1, "Tên dịch vụ là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  time_required: z.number().min(0, "Thời gian yêu cầu phải là số dương"),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

const AddService = () => {
  const addService = useServicesStore((state) => state.addService);
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
  });

  const onSubmit = (data: ServiceFormValues) => {
    addService(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Thêm dịch vụ</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-10">
            <DialogHeader>
              <DialogTitle>Thêm dịch vụ</DialogTitle>
            </DialogHeader>
          </div>

          <FieldGroup>
            <Field>
              <Label>Mã dịch vụ</Label>
              <Input {...register("service_code")} />
              {errors.service_code && (
                <p className="text-red-500 text-sm">
                  {errors.service_code.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Tên dịch vụ</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
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

            <Field>
              <Label>Thời gian yêu cầu (phút)</Label>
              <Input
                type="number"
                {...register("time_required", { valueAsNumber: true })}
              />
              {errors.time_required && (
                <p className="text-red-500 text-sm">
                  {errors.time_required.message}
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

export default AddService
