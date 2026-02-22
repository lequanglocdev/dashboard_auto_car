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
import { usePromotionStore } from "@/store/usePromotionStore";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z
  .object({
    promotion_code: z.string().min(1, "Mã khuyến mãi là bắt buộc"),
    name: z.string().min(1, "Tên khuyến mãi là bắt buộc"),
    description: z.string().optional(), // ✅ thêm dòng này
    start_date: z.string().min(1, "Chọn ngày bắt đầu"),
    end_date: z.string().min(1, "Chọn ngày kết thúc"),
  })
  .refine((data) => new Date(data.start_date) < new Date(data.end_date), {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["end_date"],
  });


type FormValues = z.infer<typeof schema>;

export const AddPromotionHeader = () => {
  const addPromotionHeader = usePromotionStore(
    (state) => state.addPromotionHeader
  );
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    await addPromotionHeader(data);

    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Thêm khuyến mãi</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Thêm khuyến mãi</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label>Mã khuyến mãi</Label>
              <Input {...register("promotion_code")} />
              {errors.promotion_code && (
                <p className="text-red-500 text-sm">
                  {errors.promotion_code.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Mô tả</Label>
              <Input {...register("description")} />
            </Field>

            <Field>
              <Label>Tên khuyến mãi</Label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </Field>

            <Field>
              <Label>Ngày bắt đầu</Label>
              <Input type="date" {...register("start_date")} />
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

          <DialogFooter className="mt-4">
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
