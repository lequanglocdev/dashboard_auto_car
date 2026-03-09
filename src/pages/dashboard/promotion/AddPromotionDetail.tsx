import { useEffect, useState } from "react";
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
import { useCustomerStore } from "@/store/useCustomerStore";
import { useServicesStore } from "@/store/useServices";

const schema = z.object({
  service_id: z.string().min(1, "Vui lòng chọn dịch vụ"),
  applicable_rank_id: z.string().min(1, "Vui lòng chọn rank"),
  discount_value: z.number().min(0, "Giá trị giảm phải >= 0"),
  min_order_value: z.number().min(0, "Giá trị đơn tối thiểu phải >= 0"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  promotionLineId: string;
}

const AddPromotionDetailDialog = ({ promotionLineId }: Props) => {
  const { customerRanks, fetchCustomerRank } = useCustomerStore();
  console.log("rank>>>",customerRanks)
  const addPromotionDetail = usePromotionStore(
    (state) => state.addPromotionDetail
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

  useEffect(() => {
    fetchCustomerRank();
  }, []);

  const { services, fetchServices } = useServicesStore();

  useEffect(() => {
    fetchCustomerRank();
    fetchServices();
  }, []);


  const onSubmit = async (data: FormValues) => {
    await addPromotionDetail(promotionLineId, data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <h4
          onClick={(e) => e.stopPropagation()}
          className="text-sm ml-1 py-1 cursor-pointer">
          Thêm chi tiết khuyến mãi
        </h4>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Thêm chi tiết khuyến mãi</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* 🔥 Dropdown Rank */}
            <Field>
              <Label>Chọn Rank</Label>
              <select
                {...register("applicable_rank_id")}
                className="w-full border rounded px-2 py-2">
                <option value="">-- Chọn rank --</option>
                {customerRanks.map((rank) => (
                  <option key={rank._id} value={rank._id}>
                    {rank.rank_name} ({rank.discount_rate}% mặc định)
                  </option>
                ))}
              </select>
              {errors.applicable_rank_id && (
                <p className="text-red-500 text-sm">
                  {errors.applicable_rank_id.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Chọn dịch vụ</Label>
              <select
                {...register("service_id")}
                className="w-full border rounded px-2 py-2">
                <option value="">-- Chọn dịch vụ --</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field>
              <Label>Giá trị giảm</Label>
              <Input
                type="number"
                {...register("discount_value", { valueAsNumber: true })}
              />
              {errors.discount_value && (
                <p className="text-red-500 text-sm">
                  {errors.discount_value.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Giá trị đơn tối thiểu</Label>
              <Input
                type="number"
                {...register("min_order_value", { valueAsNumber: true })}
              />
              {errors.min_order_value && (
                <p className="text-red-500 text-sm">
                  {errors.min_order_value.message}
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
  );
};

export default AddPromotionDetailDialog;
