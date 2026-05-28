// pages/payment/PaymentSuccess.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    // Tự động về dashboard sau 3 giây
    const timer = setTimeout(() => navigate("/admin"), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <CheckCircle2 size={64} className="text-green-500" />
      <h1 className="text-2xl font-semibold">Thanh toán thành công!</h1>
      {orderCode && (
        <p className="text-muted-foreground text-sm">Mã đơn: #{orderCode}</p>
      )}
      <p className="text-sm text-muted-foreground">
        Đang chuyển về trang chủ...
      </p>
      <button
        onClick={() => navigate("/admin")}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 transition">
        Về trang chủ
      </button>
    </div>
  );
}
