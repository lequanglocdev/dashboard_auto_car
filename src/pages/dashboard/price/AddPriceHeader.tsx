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
import { usePriceStore } from "@/store/usePriceStore";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const priceHeaderSchema = z
  .object({
    price_list_name: z.string().min(1, "Tên bảng giá là bắt buộc"),
    start_date: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
    end_date: z.string().min(1, "Ngày kết thúc là bắt buộc"),
  })
  .refine((data) => new Date(data.start_date) < new Date(data.end_date), {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["end_date"],
  });

type PriceHeaderFormValues = z.infer<typeof priceHeaderSchema>;

export const AddPriceHeader = () => {
  const addPriceHeader = usePriceStore((state) => state.addPriceHeader);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PriceHeaderFormValues>({
    resolver: zodResolver(priceHeaderSchema),
    defaultValues: {
      price_list_name: "",
      start_date: "",
      end_date: "",
    },
  });

  const onSubmit = async (data: PriceHeaderFormValues) => {
    await addPriceHeader({
      ...data,
      is_active: true,
    });

    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Thêm bảng giá</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <DialogHeader>
              <DialogTitle>Thêm bảng giá</DialogTitle>
            </DialogHeader>
          </div>

          <FieldGroup>
            <Field>
              <Label>Tên bảng giá</Label>
              <Input {...register("price_list_name")} />
              {errors.price_list_name && (
                <p className="text-red-500 text-sm">
                  {errors.price_list_name.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Ngày bắt đầu</Label>
              <Input type="date" {...register("start_date")} />
              {errors.start_date && (
                <p className="text-red-500 text-sm">
                  {errors.start_date.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Ngày kết thúc</Label>
              <Input type="date" {...register("end_date")} />
              {errors.end_date && (
                <p className="text-red-500 text-sm">
                  {errors.end_date.message}
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
};
