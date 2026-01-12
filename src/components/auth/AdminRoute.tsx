// routes/AdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminRoute() {
  const { user, accessToken, loading } = useAuthStore();

  if (loading) return null;

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  if (!user) {
    return null; // CHỜ fetchMe
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
