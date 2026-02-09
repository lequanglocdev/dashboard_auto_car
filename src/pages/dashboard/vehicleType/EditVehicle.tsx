import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import type VehicleType from "@/types/vehicle-type";
import { useVehicleTypeStore } from "@/store/useVehicleType";
type EditVehicleTypeProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  vehicle: VehicleType | null;
};

const EditVehicle = ({ open, setOpen, vehicle }: EditVehicleTypeProps) => {
  const updateVehicleType = useVehicleTypeStore((state) => state.updateVehicleType);

  const [form, setForm] = useState({
    vehicle_type_name: "",
    description: "",
  });

  useEffect(() => {
    if (vehicle) {
      setForm({
        vehicle_type_name: vehicle.vehicle_type_name || "",
        description: vehicle.description || "",
      });
    }
  }, [vehicle]);

  const handleSubmit = async () =>{
    if(vehicle){
      await updateVehicleType(vehicle._id, form);
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật phương tiện</DialogTitle>
        </DialogHeader>

        <Input
          value={form.vehicle_type_name}
          onChange={(e) => setForm({ ...form, vehicle_type_name: e.target.value })}
          placeholder="Tên loại xe"
        />

        <Input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Mô tả"
        />

        <Button variant={"destructive"} onClick={handleSubmit}>Lưu</Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicle;
