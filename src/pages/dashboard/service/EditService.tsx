import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState, useEffect } from "react";
import { useServicesStore } from "@/store/useServices";

type EditServiceProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  service: any | null;
};

const EditService = ({open, setOpen, service}: EditServiceProps) => {
  const updateService = useServicesStore((state) => state.updateService);
  const [form, setForm] = useState({
      service_code: service?.service_code || "",
      name: service?.name || "",
      description: service?.description || "",
      time_required: service?.time_required || 0,
  });
  useEffect(() => {
    if (service) {
      setForm({
        service_code: service.service_code,
        name: service.name,
        description: service.description,
        time_required: service.time_required,
      });
    }
  }, [service]);
  const handleSubmit = async () => {
    if (service) {
      await updateService(service._id, form);
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật dịch vụ</DialogTitle>
        </DialogHeader>
        <Input
          value={form.service_code}
          onChange={(e) => setForm({ ...form, service_code: e.target.value })}
          placeholder="Mã dịch vụ"
        />
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Họ tên"
        />
        <Input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Mô tả"
        />

        <Input
          value={form.time_required}
          onChange={(e) => setForm({ ...form, time_required: parseInt(e.target.value) || 0 })}
          placeholder="Thời gian yêu cầu (phút)"
        />

        <Button variant={"destructive"} onClick={handleSubmit}>
          Lưu
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditService;
