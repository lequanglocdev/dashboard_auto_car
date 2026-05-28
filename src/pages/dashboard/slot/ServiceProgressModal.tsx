// components/ServiceProgressModal.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, X, Clock, Wrench } from "lucide-react";
import { useAppointmentStore } from "@/store/useAppointmentStore";
import { useSlotsStore } from "@/store/slotStore";

interface Props {
  appointmentId: string | null;
  onClose: () => void;
}

export function ServiceProgressModal({ appointmentId, onClose }: Props) {
  const navigate = useNavigate();
  const {
    selectedAppointment,
    getAppointmentById,
    toggleServiceDone,
    completeAppointment,
    arriveAppointment,
    isLoading,
  } = useAppointmentStore();
  const { fetchSlots } = useSlotsStore();

  useEffect(() => {
    if (appointmentId) {
      getAppointmentById(appointmentId);
    }
  }, [appointmentId]);

  if (!appointmentId) return null;

  const appt = selectedAppointment;
  const services = appt?.services ?? [];
  const doneCount = services.filter((s) => s.is_done).length;
  const allDone = services.length > 0 && doneCount === services.length;
  const progressPct = services.length ? (doneCount / services.length) * 100 : 0;

  // Kiểm tra appointment đang ở trạng thái nào
  const isWaiting = appt?.status === "waiting";
  const isInProgress = appt?.status === "in_progress";

  const handleToggle = async (appServiceId: string) => {
    if (!isInProgress) return; // chỉ toggle khi xe đã vào gara
    await toggleServiceDone(appServiceId);
    await getAppointmentById(appointmentId);
  };

  const handleArrive = async () => {
    if (!appointmentId) return;
    await arriveAppointment(appointmentId);
    await getAppointmentById(appointmentId);
  };

  const handleComplete = async () => {
    if (!appointmentId || !allDone) return;
    await completeAppointment(appointmentId);
    await fetchSlots(1, 10);
    onClose();
    // Trong handleComplete(), thay navigate cũ thành:
    navigate(`/invoice/new?appointmentId=${appointmentId}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Wrench size={18} className="text-muted-foreground" />
            <h2 className="text-base font-semibold">Tiến trình dịch vụ</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition">
            <X size={18} />
          </button>
        </div>

        {/* ── Status badge ── */}
        {appt && (
          <div className="px-6 pt-4 flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                isWaiting
                  ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                  : isInProgress
                  ? "bg-blue-50 text-blue-700 border-blue-300"
                  : "bg-green-50 text-green-700 border-green-300"
              }`}>
              {isWaiting
                ? "⏳ Đang chờ xe vào"
                : isInProgress
                ? "🔧 Đang thực hiện"
                : "✅ Hoàn thành"}
            </span>
          </div>
        )}

        {/* ── Progress bar ── */}
        <div className="px-6 pt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span className="font-medium">Tiến độ hoàn thành</span>
            <span>
              {doneCount}/{services.length} dịch vụ
            </span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                allDone ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* ── Customer + vehicle summary ── */}
        {appt && (
          <div className="mx-6 mt-4 rounded-lg bg-muted/40 px-4 py-3 text-sm space-y-0.5">
            <p className="font-medium text-foreground">
              {(appt as any).customer_id?.name ?? "—"}
            </p>
            <p className="text-muted-foreground text-xs">
              {(appt as any).vehicle_id?.manufacturer} —{" "}
              {(appt as any).vehicle_id?.license_plate}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-0.5">
              <Clock size={12} />
              <span>Tổng ước tính: {appt.total_time} phút</span>
            </div>
          </div>
        )}

        {/* ── Service list ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {isLoading && !appt ? (
            // Skeleton loading
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
            ))
          ) : services.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Không có dịch vụ nào
            </p>
          ) : (
            services.map((svc, idx) => (
              <div
                key={svc.appServiceId}
                onClick={() => handleToggle(svc.appServiceId)}
                className={`flex items-center justify-between p-3 rounded-lg border transition
                  ${isInProgress ? "cursor-pointer" : "cursor-default"}
                  ${
                    svc.is_done
                      ? "border-green-300 bg-green-50 dark:bg-green-950/40"
                      : isInProgress
                      ? "border-border hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-950/20"
                      : "border-border opacity-60"
                  }`}>
                <div className="flex items-center gap-3">
                  {/* Step number / check */}
                  <div className="shrink-0">
                    {svc.is_done ? (
                      <CheckCircle2 size={22} className="text-green-500" />
                    ) : (
                      <div className="w-[22px] h-[22px] rounded-full border-2 border-muted-foreground/40 flex items-center justify-center">
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          {idx + 1}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <p
                      className={`text-sm font-medium leading-snug ${
                        svc.is_done
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}>
                      {svc.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {svc.time_required} phút
                      {svc.time_completed && (
                        <span className="ml-2 text-green-600">
                          ✓{" "}
                          {new Date(svc.time_completed).toLocaleTimeString(
                            "vi-VN",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <span className="text-sm font-medium text-right shrink-0">
                  {svc.price.toLocaleString("vi-VN")} đ
                </span>
              </div>
            ))
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-border space-y-3">
          {/* Tổng chi phí */}
          {appt && (
            <div className="flex justify-between text-sm font-semibold">
              <span>Tổng chi phí</span>
              <span>{appt.total_cost?.toLocaleString("vi-VN")} đ</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition">
              Đóng
            </button>

            {/* Xe chưa vào → show nút "Xe đã vào gara" */}
            {isWaiting && (
              <button
                onClick={handleArrive}
                disabled={isLoading}
                className="flex-1 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition">
                Xe đã vào gara
              </button>
            )}

            {/* Đang thực hiện → show nút hoàn tất */}
            {isInProgress && (
              <button
                onClick={handleComplete}
                disabled={!allDone || isLoading}
                className="flex-1 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title={
                  !allDone
                    ? "Vui lòng hoàn thành tất cả dịch vụ trước"
                    : undefined
                }>
                {allDone
                  ? "✓ Hoàn tất & Thanh toán →"
                  : `Còn ${services.length - doneCount} dịch vụ`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
