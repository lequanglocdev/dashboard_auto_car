import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCustomerStore } from "@/store/useCustomerStore";
import { useState, useEffect } from "react";
import type Customer from "@/types/customer";

type EditCustomerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  customer: Customer | null;
};

export const EditCustomer = ({ open, setOpen, customer }: EditCustomerProps) => {
  const updateCustomer = useCustomerStore((state) => state.updateCustomer);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  useEffect(() => {
    if (customer) {
      setForm(customer);
    }
  }, [customer]);

  const handleSubmit = async () => {
    if (customer) {
      await updateCustomer(customer._id, form);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật khách hàng</DialogTitle>
        </DialogHeader>

        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Họ tên"
        />

        <Input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
        />

        <Input
          value={form.phone_number}
          onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
          placeholder="SĐT"
        />

        <Input
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Địa chỉ"
        />

        <Button onClick={handleSubmit}>Lưu</Button>
      </DialogContent>
    </Dialog>
  );
};
