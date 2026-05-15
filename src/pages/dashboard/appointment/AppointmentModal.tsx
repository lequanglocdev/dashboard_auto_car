// pages/dashboard/appointment/AppointmentModal.tsx
import {useState} from 'react';
import { toast } from 'sonner';
import { useAppointmentStore } from '@/store/useAppointmentStore';
import { useCustomerStore } from '@/store/useCustomerStore';   // store có sẵn
import { usePriceStore } from '@/store/usePriceStore';         // store có sẵn
import type Vehicle from '@/types/vehicle';
import type { PriceLine } from '@/types/price';
import { CircleFadingPlus } from 'lucide-react';
import { useSlotsStore } from '@/store/slotStore';

export default function AppointmentModal() {
  const { isModalOpen, preselectedSlotId, closeModal, createAppointment } = useAppointmentStore();
  const { findByContact } = useCustomerStore();
  const { fetchSlots } = useSlotsStore();
  // ── dùng store có sẵn ──────────────────────────────────
 const { priceLines, fetchPriceLinesByVehicleType } = usePriceStore();

  // ── local state ────────────────────────────────────────
  const [query, setQuery] = useState('');
  const [customerData, setCustomerData] = useState<Awaited<ReturnType<typeof getCustomerByIdWithVehicles>> | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedServices, setSelectedServices] = useState<PriceLine[]>([]);

  const availableServices = priceLines.filter(
    (s) => !selectedServices.find((ss) => ss._id === s._id)
  );

  const totalTime = selectedServices.reduce((acc, s) => acc + (s as any).time_required, 0);
  const totalCost = selectedServices.reduce((acc, s) => acc + s.price, 0);

  if (!isModalOpen) return null;

  // ── handlers ───────────────────────────────────────────

  const handleClose = () => {
    closeModal();
    setQuery('');
    setCustomerData(null);
    setSelectedVehicle(null);
    setSelectedServices([]);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const data = await findByContact(query.trim());
      setCustomerData(data);
      setSelectedVehicle(null);
      setSelectedServices([]);
    } catch {
      setCustomerData(null);
      toast.error("Khách hàng không có trong hệ thống");
    }
  };

  const handleVehicleSelect = async (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedServices([]);

    const vehicleTypeId = (vehicle as any).vehicle_type_id?._id;
    if (vehicleTypeId) {
      await fetchPriceLinesByVehicleType(vehicleTypeId);
    } else {
      toast.error("Không tìm thấy loại xe.");
    }
  };
  const handleToggleService = (service: PriceLine) => {
    setSelectedServices((prev) =>
      prev.find((s) => s._id === service._id)
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, service]
    );
  };

  const handleSubmit = async () => {
    if (!customerData || !selectedVehicle || selectedServices.length === 0) {
      toast.error("Vui lòng chọn xe và dịch vụ!");
      return;
    }
    try {
      await createAppointment({
        slot_id: preselectedSlotId ?? null,
        vehicle_id: selectedVehicle._id,
        service_ids: selectedServices.map((s) => (s as any).service_id?._id),
        appointment_datetime: new Date().toISOString(),
      });
      await fetchSlots(1, 10); // ← fetch lại sau khi đặt thành công
      handleClose();
    } catch {
      // error đã được toast trong store
    }
  };

  // ── render ─────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold">Đặt dịch vụ</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">
          {/* Tìm khách hàng */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Số điện thoại hoặc email
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                placeholder="0909... hoặc email@..."
                className="flex-1 border rounded-md px-3 py-2 text-sm bg-background"
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (!e.target.value.trim()) {
                    setCustomerData(null);
                    setSelectedVehicle(null);
                    setSelectedServices([]);
                  }
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500 transition">
                Tìm
              </button>
            </div>
          </div>

          {/* Khách hàng + xe */}
          {customerData && (
            <div className="grid grid-cols-2 gap-4 bg-muted/40 rounded-lg p-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Khách hàng
                </p>
                <p className="text-sm font-medium">
                  {customerData.customer.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {customerData.customer.phone_number}
                </p>
                <p className="text-sm text-muted-foreground">
                  {customerData.customer.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {customerData.customer.address}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Phương tiện
                </p>
                {customerData.vehicles?.length > 0 ? (
                  <div className="space-y-2">
                    {customerData.vehicles.map((v: Vehicle) => (
                      <div
                        key={v._id}
                        onClick={() => handleVehicleSelect(v)}
                        className={`cursor-pointer rounded-md border px-3 py-2 text-sm transition
                          ${
                            selectedVehicle?._id === v._id
                              ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                              : "border-border hover:border-blue-400"
                          }`}>
                        <p className="font-medium">
                          {(v as any).manufacturer} — {v.license_plate}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(v as any).vehicle_type_id?.vehicle_type_name}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-red-500">
                    Khách hàng không có xe.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Bảng dịch vụ */}
          {selectedVehicle && availableServices.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Bảng dịch vụ</p>
              <div className="max-h-48 overflow-y-auto rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground text-xs uppercase sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Tên dịch vụ</th>
                      <th className="px-3 py-2 text-left">Thời gian</th>
                      <th className="px-3 py-2 text-left">Giá</th>
                      <th className="px-3 py-2 text-center">Thêm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableServices.map((s) => (
                      <tr
                        key={s._id}
                        className="border-t border-border hover:bg-muted/30">
                        <td className="px-3 py-2">
                          {(s as any).service_name ?? s._id}
                        </td>
                        <td className="px-3 py-2">
                          {(s as any).time_required} phút
                        </td>
                        <td className="px-3 py-2">
                          {s.price.toLocaleString("vi-VN")} đ
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button onClick={() => handleToggleService(s)}>
                            <CircleFadingPlus className="text-green-600 hover:text-green-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Dịch vụ đã chọn */}
          {selectedServices.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Dịch vụ đã chọn</p>
              <div className="rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-3 py-2 text-left">Tên dịch vụ</th>
                      <th className="px-3 py-2 text-left">Thời gian</th>
                      <th className="px-3 py-2 text-left">Giá</th>
                      <th className="px-3 py-2 text-center">Xoá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedServices.map((s) => (
                      <tr key={s._id} className="border-t border-border">
                        <td className="px-3 py-2">
                          {(s as any).service_name ?? s._id}
                        </td>
                        <td className="px-3 py-2">
                          {(s as any).time_required} phút
                        </td>
                        <td className="px-3 py-2">
                          {s.price.toLocaleString("vi-VN")} đ
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button onClick={() => handleToggleService(s)}>
                            <CircleFadingPlus className="text-red-500 hover:text-red-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 space-y-1 text-sm font-medium text-right">
                <p>
                  Tổng thời gian: <span>{totalTime} phút</span>
                </p>
                <p>
                  Tổng phí: <span>{totalCost.toLocaleString("vi-VN")} đ</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedVehicle || selectedServices.length === 0}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition">
            Đặt lịch
          </button>
        </div>
      </div>
    </div>
  );
}
