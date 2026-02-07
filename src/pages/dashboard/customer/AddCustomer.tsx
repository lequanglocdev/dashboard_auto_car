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
import { useCustomerStore } from "@/store/useCustomerStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const customerFormSchema = z.object({
  username: z.string().min(1, "Tên khách hàng là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  phone_number: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

export const AddCustomer = () => {
  const addCustomer = useCustomerStore((state) => state.addCustomer);
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      phone_number: "",
      address: "",
    },
  });

  const onSubmit = async (data: any) => {
    await addCustomer(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Thêm khách hàng</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-10">
            <DialogHeader>
              <DialogTitle>Thêm khách hàng</DialogTitle>
            </DialogHeader>
          </div>

          <FieldGroup>
            <Field>
              <Label>Tên khách hàng</Label>
              <Input {...register("username")} />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Email</Label>
              <Input {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </Field>

            <Field>
              <Label>SĐT</Label>
              <Input {...register("phone_number")} />
              {errors.phone_number && (
                <p className="text-red-500 text-sm">
                  {errors.phone_number.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Địa chỉ</Label>
              <Input {...register("address")} />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </Field>
          </FieldGroup>

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
        </form>
      </DialogContent>
    </Dialog>
  );
};
