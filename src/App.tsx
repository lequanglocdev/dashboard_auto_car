import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
// import Overview from "./pages/dashboard/Overview";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./pages/home/HomePage";
import AdminRoute from "./components/auth/AdminRoute";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

function App() {
  const { accessToken, fetchMe } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      fetchMe().catch(() => {});
    }
  }, [accessToken]);

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Navigate to="/signin" replace />} /> */}
          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
