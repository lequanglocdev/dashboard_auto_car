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
import Customer from "./pages/dashboard/customer/Customer";
import Service from "./pages/dashboard/service/Service";
import Price from "./pages/dashboard/price/Price";
import Promotion from "./pages/dashboard/promotion/Promotion";
import Invoice from "./pages/dashboard/invoice/Invoice";
import Vehicle from "./pages/dashboard/vehicleType/Vehicle";
import CustomerDetail from "./pages/dashboard/customer/CustomerDetail";

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
            <Route path="/customer" element={<Customer />} />
            <Route path="/customer/:id" element={<CustomerDetail  />} />
            <Route path="/vehicle-type" element={<Vehicle />} />
            <Route path="/service" element={<Service />} />
            <Route path="/price" element={<Price />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/promotion" element={<Promotion />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
