import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import Overview from "./pages/dashboard/Overview";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
function App() {
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
            <Route path="/" element={<Overview />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
