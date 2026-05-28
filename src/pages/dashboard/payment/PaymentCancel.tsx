// pages/payment/PaymentCancel.tsx
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <XCircle size={64} className="text-red-400" />
      <h1 className="text-2xl font-semibold">Thanh toán bị hủy</h1>
      <p className="text-sm text-muted-foreground">
        Giao dịch không được hoàn tất. Hóa đơn vẫn ở trạng thái chờ.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-2 rounded-lg border text-sm hover:bg-muted transition">
        ← Quay lại hóa đơn
      </button>
    </div>
  );
}
