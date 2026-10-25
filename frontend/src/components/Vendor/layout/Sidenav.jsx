import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidenav = ({ open, onClose }) => {
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState({
    products: location.pathname.startsWith("/vendor/products"),
    orders: location.pathname.startsWith("/vendor/orders"),
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-white text-gray-950"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed
          top-16
          bottom-0
          left-0
          z-50
          w-64
          bg-gray-950
          text-white
          overflow-y-auto
          transition-transform
          duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >

        {/* Sidebar Header */}
        <div className="px-5 py-5 border-b border-gray-800">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Vendor Panel
          </p>

          <h2 className="mt-1 text-lg font-semibold">
            Store Management
          </h2>
        </div>


        <nav className="p-4">

          {/* MAIN */}
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Main
          </p>


          {/* Dashboard */}
          <NavLink
            to="/vendor"
            end
            onClick={onClose}
            className={navLinkClass}
          >
            <span className="w-5">📊</span>
            <span>Dashboard</span>
          </NavLink>


          {/* =====================
              PRODUCTS
          ====================== */}

          <div className="mt-2">

            <button
              type="button"
              onClick={() => toggleMenu("products")}
              className={`
                w-full
                flex
                items-center
                justify-between
                px-4
                py-3
                rounded-lg
                text-sm
                font-medium
                transition
                ${
                  location.pathname.startsWith("/vendor/products")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }
              `}
            >

              <div className="flex items-center gap-3">
                <span className="w-5">📦</span>
                <span>Products</span>
              </div>

              <span
                className={`transition-transform ${
                  openMenus.products ? "rotate-90" : ""
                }`}
              >
                ›
              </span>

            </button>


            {/* Product submenu */}
            {openMenus.products && (
              <div className="ml-5 mt-1 border-l border-gray-700 pl-3 space-y-1">

                <NavLink
                  to="/vendor/products"
                  end
                  onClick={onClose}
                  className={navLinkClass}
                >
                  <span>All Products</span>
                </NavLink>

                <NavLink
                  to="/vendor/products/add"
                  onClick={onClose}
                  className={navLinkClass}
                >
                  <span>Add Product</span>
                </NavLink>

                {/* Edit product normally opened with ID */}
                <NavLink
                  to="/vendor/products/edit/1"
                  onClick={onClose}
                  className={navLinkClass}
                >
                  <span>Edit Product</span>
                </NavLink>

              </div>
            )}

          </div>


          {/* =====================
              ORDERS
          ====================== */}

          <div className="mt-2">

            <button
              type="button"
              onClick={() => toggleMenu("orders")}
              className={`
                w-full
                flex
                items-center
                justify-between
                px-4
                py-3
                rounded-lg
                text-sm
                font-medium
                transition
                ${
                  location.pathname.startsWith("/vendor/orders")
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }
              `}
            >

              <div className="flex items-center gap-3">
                <span className="w-5">🛒</span>
                <span>Orders</span>
              </div>

              <span
                className={`transition-transform ${
                  openMenus.orders ? "rotate-90" : ""
                }`}
              >
                ›
              </span>

            </button>


            {openMenus.orders && (
              <div className="ml-5 mt-1 border-l border-gray-700 pl-3 space-y-1">

                <NavLink
                  to="/vendor/orders"
                  end
                  onClick={onClose}
                  className={navLinkClass}
                >
                  All Orders
                </NavLink>

                <NavLink
                  to="/vendor/orders/pending"
                  onClick={onClose}
                  className={navLinkClass}
                >
                  Pending Orders
                </NavLink>

                <NavLink
                  to="/vendor/orders/completed"
                  onClick={onClose}
                  className={navLinkClass}
                >
                  Completed Orders
                </NavLink>

              </div>
            )}

          </div>


          {/* =====================
              CUSTOMERS
          ====================== */}

          <NavLink
            to="/vendor/customers"
            onClick={onClose}
            className={navLinkClass}
          >
            <span className="w-5">👥</span>
            <span>Customers</span>
          </NavLink>


          {/* =====================
              SETTINGS
          ====================== */}

          <div className="mt-2">

            <NavLink
              to="/vendor/settings"
              onClick={onClose}
              className={navLinkClass}
            >
              <span className="w-5">⚙️</span>
              <span>Settings</span>
            </NavLink>

          </div>

        </nav>


        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-950 border-t border-gray-800">

          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidenav;