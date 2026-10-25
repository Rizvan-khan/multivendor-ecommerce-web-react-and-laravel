import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Topbar from "./Topbar";
import Sidenav from "./Sidenav";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Topbar */}
      <Topbar
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* Sidebar */}
      <Sidenav
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Page Content */}
      <main className="pt-16 lg:pl-64 min-h-screen">

        <div className="p-4 sm:p-6 lg:p-8">

          {/* Child pages render here */}
          <Outlet />

        </div>

      </main>

    </div>
  );
};

export default MainLayout;