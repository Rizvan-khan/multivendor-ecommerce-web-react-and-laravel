import React from "react";

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-gray-200">

      <div className="h-full px-4 lg:px-6 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-3">

          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 rounded-lg hover:bg-gray-100 text-xl"
          >
            ☰
          </button>


          {/* Logo */}
          <div className="flex items-center gap-2">

            <div className="w-9 h-9 bg-gray-950 text-white rounded-lg flex items-center justify-center font-bold">
              V
            </div>

            <div>
              <h1 className="font-bold text-gray-900 leading-none">
                VendorPanel
              </h1>

              <p className="text-[10px] text-gray-500 mt-1">
                Store Management
              </p>
            </div>

          </div>

        </div>


        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Search */}
          <div className="hidden md:block">

            <input
              type="text"
              placeholder="Search..."
              className="w-56 lg:w-72 px-4 py-2.5 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-300"
            />

          </div>


          {/* Notification */}
          <button
            type="button"
            className="relative w-10 h-10 rounded-lg hover:bg-gray-100"
          >
            🔔

            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>


          {/* Profile */}
          <div className="flex items-center gap-2">

            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              👤
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">
                Vendor
              </p>

              <p className="text-xs text-gray-500">
                Store Owner
              </p>
            </div>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Topbar;