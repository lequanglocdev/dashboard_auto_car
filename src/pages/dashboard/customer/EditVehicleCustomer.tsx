import type Vehicle from "@/types/vehicle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useVehicleTypeStore } from "@/store/useVehicleType";
import { Button } from "@/components/ui/button";
import { useVehicleByCustomerStore } from "@/store/useVehicleByCustomer";

type EditVehicleCustomerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  vehicle: Vehicle | null;
};

const EditVehicleCustomer = ({
  open,
  setOpen,
  vehicle,
}: EditVehicleCustomerProps) => {
  const vehicleTypes = useVehicleTypeStore((state) => state.vehicleTypes);
  const updateVehicleByCustomerId = useVehicleByCustomerStore(
    (state) => state.updateVehicleByCustomerId
  );
  const [form, setForm] = useState({
    vehicle_type_id: "",
    license_plate: "",
    manufacturer: "",
    model: "",
    year: "",
    color: "",
  });
  useEffect(() => {
    if (vehicle) {
      setForm({
        vehicle_type_id: vehicle.vehicle_type_id._id,
        license_plate: vehicle.license_plate,
        manufacturer: vehicle.manufacturer,
        model: vehicle.model,
        year: vehicle.year.toString(),
        color: vehicle.color,
      });
    }
  }, [vehicle]);

  const handleSubmit = async () => {
    if (!vehicle) return;
    await updateVehicleByCustomerId(vehicle.customer_id, vehicle._id, {
      vehicle_type_id: form.vehicle_type_id,
      license_plate: form.license_plate,
      manufacturer: form.manufacturer,
      model: form.model,
      year: parseInt(form.year),
      color: form.color,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật xe</DialogTitle>
        </DialogHeader>

        <select
          className="w-full border rounded-md px-3 py-2"
          value={form.vehicle_type_id}
          onChange={(e) =>
            setForm({
              ...form,
              vehicle_type_id: e.target.value,
            })
          }>
          {vehicleTypes.map((type) => (
            <option key={type._id} value={type._id}>
              {type.vehicle_type_name}
            </option>
          ))}
        </select>

        <Input
          value={form.license_plate}
          onChange={(e) => setForm({ ...form, license_plate: e.target.value })}
          placeholder="Biên số xe"
        />
        <Input
          value={form.manufacturer}
          onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
          placeholder="Hãng xe"
        />

        <Input
          value={form.year}
          onChange={(e) => setForm({ ...form, year: e.target.value })}
          placeholder="Nam sản xuất"
        />

        <Input
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
          placeholder="Màu xe"
        />

        <Button variant={"destructive"} onClick={handleSubmit}>
          Lưu
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleCustomer;
