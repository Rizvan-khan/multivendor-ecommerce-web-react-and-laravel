import React from "react";

const Dashboard = () => {
  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm text-gray-500">
            Total Sales
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            ₹1,24,500
          </h2>
        </div>


        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm text-gray-500">
            Orders
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            1,248
          </h2>
        </div>


        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm text-gray-500">
            Products
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            356
          </h2>
        </div>


        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm text-gray-500">
            Customers
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            2,845
          </h2>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;