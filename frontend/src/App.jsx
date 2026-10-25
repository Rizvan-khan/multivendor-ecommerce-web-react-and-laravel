import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./components/Vendor/layout/MainLayout";

// Dashboard
import Dashboard from "./pages/vendor/Dashboard";

// Settings
import Settings from "./pages/vendor/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            VENDOR PANEL
        ========================== */}

        <Route path="/vendor" element={<MainLayout />}>

          {/* Dashboard */}
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

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