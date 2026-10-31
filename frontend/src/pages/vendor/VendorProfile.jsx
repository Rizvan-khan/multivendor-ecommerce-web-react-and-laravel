import React, { useState, useEffect } from 'react';
import { api, getApiError } from '../../api/https';
import CustomTable from '../tables/CustomTable';

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [store, setStore] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Edit Toggles & Form States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingStore, setIsEditingStore] = useState(false);

  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [storeForm, setStoreForm] = useState({ store_name: '', description: '' });

  // 1. Fetch Vendor Profile & Store Profile
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Parallel API calls
      const [profileRes, storeRes] = await Promise.all([
        api.get('/vendor/profile'),
        api.get('/vendor/store/profile')
      ]);

      const vendorData = profileRes.data.user;
      const storeData = storeRes.data.data.store;

      setVendor(vendorData);
      setStore(storeData);

      // Form initial values set kiye
      setProfileForm({
        name: vendorData.name || '',
        email: vendorData.email || '',
        phone: vendorData.phone || ''
      });

      setStoreForm({
        store_name: storeData?.store_name || '',
        description: storeData?.description || ''
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMsg(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Profile Update Submission
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg(null);
      setSuccessMsg(null);

      await api.put('/vendor/profile/update', profileForm);
      setSuccessMsg("Vendor profile successfully update ho gayi! 🚀");
      setIsEditingProfile(false);
      fetchData(); // Data refresh karne ke liye
    } catch (error) {
      setErrorMsg(getApiError(error));
    }
  };

  // Handle Store Update Submission
  const handleStoreUpdate = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg(null);
      setSuccessMsg(null);

      await api.put('/vendor/store/update', storeForm);
      setSuccessMsg("Store profile successfully update ho gayi! 🏪");
      setIsEditingStore(false);
      fetchData(); // Data refresh karne ke liye
    } catch (error) {
      setErrorMsg(getApiError(error));
    }
  };

  // Vendor Table Columns
  const vendorColumns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    {
      header: "Role",
      render: (row) => (
        <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold uppercase">
          {row.role}
        </span>
      )
    },
    {
      header: "Action",
      render: () => (
        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white px-3 py-1 rounded text-sm transition"
        >
          {isEditingProfile ? "Cancel" : "Edit Profile"}
        </button>
      )
    }
  ];

  // Store Table Columns
  const storeColumns = [
    { header: "ID", accessor: "id" },
    { header: "Store Name", render: (row) => row.store_name || "Not Set" },
    { header: "Description", render: (row) => row.description || "No description provided" },
    {
      header: "Action",
      render: () => (
        <button
          onClick={() => setIsEditingStore(!isEditingStore)}
          className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white px-3 py-1 rounded text-sm transition"
        >
          {isEditingStore ? "Cancel" : "Edit Store"}
        </button>
      )
    }
  ];

  if (loading) {
    return (
      <div className="p-8 bg-gray-950 min-h-screen text-white flex items-center justify-center">
        <p className="text-blue-400 text-lg">Data load ho raha hai... ⏳</p>
      </div>
    );
  }

  return (
    <div className='p-8 bg-gray-950 min-h-screen text-white space-y-10'>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-blue-400">
          ⚙️ Vendor & Store Management Dashboard
        </h1>

        {/* Global Alerts */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-500 text-red-300 rounded-lg">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-600/20 border border-green-500 text-green-300 rounded-lg">
            ✅ {successMsg}
          </div>
        )}

        {/* 1. Vendor Profile Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-200">Vendor Profile Details</h2>
          <CustomTable columns={vendorColumns} data={vendor ? [vendor] : []} />

          {/* Edit Profile Form (Toggles when Edit button is clicked) */}
          {isEditingProfile && (
            <form onSubmit={handleProfileUpdate} className="mt-6 pt-6 border-t border-gray-800 space-y-4">
              <h3 className="text-lg font-semibold text-yellow-400">Edit Vendor Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2.5 text-white"
                  />
                </div>
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded font-medium transition">
                Save Profile Changes
              </button>
            </form>
          )}
        </div>

        {/* 2. Vendor Shop Management Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-gray-200">Vendor Shop Details</h2>
          <CustomTable columns={storeColumns} data={store ? [store] : []} />

          {/* Edit Store Form (Toggles when Edit button is clicked) */}
          {isEditingStore && (
            <form onSubmit={handleStoreUpdate} className="mt-6 pt-6 border-t border-gray-800 space-y-4">
              <h3 className="text-lg font-semibold text-yellow-400">Edit Store Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Store Name</label>
                  <input
                    type="text"
                    value={storeForm.store_name}
                    onChange={(e) => setStoreForm({ ...storeForm, store_name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2.5 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={storeForm.description}
                    onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2.5 text-white"
                  />
                </div>
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded font-medium transition">
                Save Store Changes
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default VendorProfile;