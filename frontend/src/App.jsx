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
import AddProduct from './pages/vendor/product/AddProduct';
import MainPage from './components/admin/MainPage';
import AdminDashboard from './pages/admin/Dashboard';
import User from './pages/admin/usermanage/User';
import Category from './pages/admin/category/Category';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<MainPage />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="user-management" element={<User />} />
            <Route path="categories" element={<Category />} />

          </Route>
        </Route>

        {/* =========================
            VENDOR PANEL (PROTECTED)
        ========================== */}
        <Route element={<ProtectedRoute />}>
          <Route path="/vendor" element={<MainLayout />}>

            {/* Dashboard */}
            <Route index element={<Dashboard />} />

            <Route path="products/add" element={<AddProduct />} />

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