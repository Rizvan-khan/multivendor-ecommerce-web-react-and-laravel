import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./components/Vendor/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute"; // <-- Import protected route

// Dashboard
import Dashboard from "./pages/vendor/Dashboard";

// Settings
import Settings from "./pages/vendor/Settings";
import Login from './pages/Login';
import VendorProfile from './pages/vendor/VendorProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* =========================
            VENDOR PANEL (PROTECTED)
        ========================== */}
        <Route element={<ProtectedRoute />}>
          <Route path="/vendor" element={<MainLayout />}>

            {/* Dashboard */}
            <Route index element={<Dashboard />} />

            {/* Profile */}
            <Route path="profile" element={<VendorProfile />} />

            {/* Settings */}
            <Route path="settings" element={<Settings />} />

          </Route>
        </Route>


        {/* Root */}
        <Route
          path="/"
          element={
            <Navigate
              to="/vendor"
              replace
            />
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Navigate
              to="/vendor"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;