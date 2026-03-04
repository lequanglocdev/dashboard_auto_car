import { useState } from "react";
import { usePromotionStore } from "@/store/usePromotionStore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Field, FieldGroup } from "@/components/ui/field";

const schema = z
  .object({
    discount_type: z.enum(["percentage", "fixed"]),
    description: z.string().min(1),
    start_date: z.string().min(1),
    end_date: z.string().min(1),
  })
  .refine((data) => data.start_date < data.end_date, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["end_date"],
  });

type FormValues = z.infer<typeof schema>;

interface Props {
  headerId: string;
}

const AddPromotionLineDialog = ({ headerId }: Props) => {
  const addPromotionLine = usePromotionStore((state) => state.addPromotionLine);

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
    await addPromotionLine(headerId, { ...data, is_active: true });
    reset();
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="text-green-500">
            Thêm
          </button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Thêm dòng khuyến mãi</DialogTitle>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label className="py-4">Loại khuyến mãi</Label>
                <select
                  {...register("discount_type")}
                  className="w-full border rounded-md h-9 px-3 bg-background">
                  <option value="">-- Chọn loại khuyến mãi --</option>
                  <option value="percentage">Phần trăm (%)</option>
                  <option value="fixed">Giảm cố định (VNĐ)</option>
                </select>

                {errors.discount_type && (
                  <p className="text-red-500 text-sm">
                    {errors.discount_type.message}
                  </p>
                )}
              </Field>
              <Field>
                <Label className="py-4">Mô tả</Label>
                <Input
                  type="text"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
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
    </>
  );
};

export default AddPromotionLineDialog;
