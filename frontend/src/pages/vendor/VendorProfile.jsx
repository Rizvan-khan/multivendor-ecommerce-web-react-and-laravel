import React, { useState, useEffect } from 'react';
import { api, getApiError } from '../../api/https';
import CustomTable from '../tables/CustomTable';

const inputCls = "w-full bg-gray-800 border border-gray-700 rounded p-2.5 text-white";
const labelCls = "block text-sm text-gray-400 mb-1";

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const makeEmptyHours = () =>
  Object.fromEntries(DAYS.map((d) => [d, { open: '', close: '' }]));

// StoreProfileRequest ke hisab se FLAT form
const emptyStoreForm = {
  shop_name: '',
  logo: null,   // File ya null
  banner: null, // File ya null
  description: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  return_policy: '',
  shipping_policy: '',
  business_hours: makeEmptyHours(),
  is_vacation_mode: false,
};

// API (nested) -> form (flat)
const toStoreForm = (s) => {
  const hours = makeEmptyHours();
  if (s?.business_hours && typeof s.business_hours === 'object') {
    DAYS.forEach((d) => {
      hours[d] = {
        open: s.business_hours[d]?.open || '',
        close: s.business_hours[d]?.close || '',
      };
    });
  }
  return {
    shop_name: s?.shop_name || '',
    logo: null,
    banner: null,
    description: s?.description || '',
    phone: s?.contact_details?.phone || '',
    email: s?.contact_details?.email || '',
    address: s?.pickup_address?.address || '',
    city: s?.pickup_address?.city || '',
    state: s?.pickup_address?.state || '',
    pincode: s?.pickup_address?.pincode || '',
    country: s?.pickup_address?.country || 'India',
    return_policy: s?.policies?.return_policy || '',
    shipping_policy: s?.policies?.shipping_policy || '',
    business_hours: hours,
    is_vacation_mode: !!s?.is_vacation_mode,
  };
};

const VendorProfile = () => {
  const [vendor, setVendor] = useState(null);
  const [store, setStore] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingStore, setIsEditingStore] = useState(false);

  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [storeForm, setStoreForm] = useState(emptyStoreForm);

  const setStoreField = (field, value) =>
    setStoreForm((prev) => ({ ...prev, [field]: value }));

  const setHour = (day, field, value) =>
    setStoreForm((prev) => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: { ...prev.business_hours[day], [field]: value },
      },
    }));

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const [profileRes, storeRes] = await Promise.all([
        api.get('/vendor/profile'),
        api.get('/vendor/store/profile'),
      ]);

      const vendorData = profileRes.data.user;
      const storeData = storeRes.data.data.store;
      console.log(storeData);

      setVendor(vendorData);
      setStore(storeData);

      setProfileForm({
        name: vendorData.name || '',
        email: vendorData.email || '',
        phone: vendorData.phone || '',
      });

      setStoreForm(toStoreForm(storeData));
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMsg(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg(null);
      setSuccessMsg(null);

      await api.post('/vendor/profile/update', profileForm);
      setSuccessMsg('Vendor profile successfully update ho gayi! 🚀');
      setIsEditingProfile(false);
      fetchData();
    } catch (error) {
      setErrorMsg(getApiError(error));
    }
  };

  const handleStoreUpdate = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg(null);
      setSuccessMsg(null);

      const fd = new FormData();

      const textFields = [
        'shop_name', 'description', 'phone', 'email', 'address', 'city',
        'state', 'pincode', 'country', 'return_policy', 'shipping_policy',
      ];
      textFields.forEach((k) => fd.append(k, storeForm[k] ?? ''));

      // File sirf tab bhejo jab nayi chuni ho
      if (storeForm.logo instanceof File) fd.append('logo', storeForm.logo);
      if (storeForm.banner instanceof File) fd.append('banner', storeForm.banner);

      // business_hours array (sirf wahi din jinme time bhara ho)
      DAYS.forEach((d) => {
        const h = storeForm.business_hours[d];
        if (h.open || h.close) {
          fd.append(`business_hours[${d}][open]`, h.open);
          fd.append(`business_hours[${d}][close]`, h.close);
        }
      });

      // Laravel boolean ke liye 1/0
      fd.append('is_vacation_mode', storeForm.is_vacation_mode ? 1 : 0);

      await api.post('/vendor/store/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMsg('Store profile successfully updated');
      setIsEditingStore(false);
      fetchData();
    } catch (error) {
      setErrorMsg(getApiError(error));
    }
  };

  const vendorColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Role',
      render: (row) => (
        <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold uppercase">
          {row.role}
        </span>
      ),
    },
    {
      header: 'Action',
      render: () => (
        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white px-3 py-1 rounded text-sm transition"
        >
          {isEditingProfile ? 'Cancel' : 'Edit Profile'}
        </button>
      ),
    },
  ];

  const storeColumns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Shop Name', render: (row) => row.shop_name || 'Not Set' },
    { header: 'Description', render: (row) => row.description || 'No description provided' },
    {
      header: 'Contact',
      render: (row) =>
        [row.contact_details?.phone, row.contact_details?.email].filter(Boolean).join(' | ') || 'Not Set',
    },
    {
      header: 'City',
      render: (row) =>
        [row.pickup_address?.city, row.pickup_address?.state].filter(Boolean).join(', ') || 'Not Set',
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.is_vacation_mode ? 'bg-orange-600/20 text-orange-400' : 'bg-green-600/20 text-green-400'
          }`}
        >
          {row.is_vacation_mode ? 'On Vacation' : 'Open'}
        </span>
      ),
    },
    {
      header: 'Preview',
      render: (row) =>
        row.public_preview_url ? (
          <a
            href={row.public_preview_url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline text-sm"
          >
            View Store
          </a>
        ) : (
          '-'
        ),
    },
    {
      header: 'Action',
      render: () => (
        <button
          onClick={() => setIsEditingStore(!isEditingStore)}
          className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white px-3 py-1 rounded text-sm transition"
        >
          {isEditingStore ? 'Cancel' : 'Edit Store'}
        </button>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white space-y-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-blue-400">
           Vendor & Store Management Dashboard
        </h1>

        {loading && <p className="mb-4 text-blue-400 text-sm">Data load ho raha hai... ⏳</p>}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-500 text-red-300 rounded-lg">
             {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-600/20 border border-green-500 text-green-300 rounded-lg">
             {successMsg}
          </div>
        )}

        {/* 1. Vendor Profile Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-200">Vendor Profile Details</h2>
          <CustomTable columns={vendorColumns} data={vendor ? [vendor] : []} />

          {isEditingProfile && (
            <form onSubmit={handleProfileUpdate} className="mt-6 pt-6 border-t border-gray-800 space-y-4">
              <h3 className="text-lg font-semibold text-yellow-400">Edit Vendor Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className={inputCls}
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

          {isEditingStore && (
            <form onSubmit={handleStoreUpdate} className="mt-6 pt-6 border-t border-gray-800 space-y-8">
              <h3 className="text-lg font-semibold text-yellow-400">Edit Store Profile</h3>

              {/* Basic Info */}
              <section className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-300">Basic Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelCls}>Store Name</label>
                    <input
                      type="text"
                      value={storeForm.shop_name}
                      onChange={(e) => setStoreField('shop_name', e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Logo (jpg/png/webp, max 2MB)</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => setStoreField('logo', e.target.files[0] || null)}
                      className={inputCls}
                    />
                    {store?.logo && !storeForm.logo && (
                      <img src={store.logo} alt="logo" className="h-12 mt-2 rounded" />
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Banner (jpg/png/webp, max 4MB)</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => setStoreField('banner', e.target.files[0] || null)}
                      className={inputCls}
                    />
                    {store?.banner && !storeForm.banner && (
                      <img src={store.banner} alt="banner" className="h-12 mt-2 rounded" />
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Description</label>
                    <textarea
                      rows={3}
                      maxLength={1000}
                      value={storeForm.description}
                      onChange={(e) => setStoreField('description', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </section>

              {/* Contact Details */}
              <section className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-300">Contact Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Store Phone</label>
                    <input
                      type="text"
                      value={storeForm.phone}
                      onChange={(e) => setStoreField('phone', e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Store Email</label>
                    <input
                      type="email"
                      value={storeForm.email}
                      onChange={(e) => setStoreField('email', e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Pickup Address */}
              <section className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-300">Pickup Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelCls}>Address</label>
                    <input
                      type="text"
                      value={storeForm.address}
                      onChange={(e) => setStoreField('address', e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                  {['city', 'state', 'pincode', 'country'].map((f) => (
                    <div key={f}>
                      <label className={labelCls}>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                      <input
                        type="text"
                        value={storeForm[f]}
                        onChange={(e) => setStoreField(f, e.target.value)}
                        className={inputCls}
                        required
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Policies */}
              <section className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-300">Policies</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Return Policy</label>
                    <textarea
                      rows={3}
                      value={storeForm.return_policy}
                      onChange={(e) => setStoreField('return_policy', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Shipping Policy</label>
                    <textarea
                      rows={3}
                      value={storeForm.shipping_policy}
                      onChange={(e) => setStoreField('shipping_policy', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </section>

              {/* Business Hours */}
              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-300">Business Hours</h4>
                <div className="grid grid-cols-3 gap-3 text-xs text-gray-500">
                  <span>Day</span>
                  <span>Open</span>
                  <span>Close</span>
                </div>
                {DAYS.map((d) => (
                  <div key={d} className="grid grid-cols-3 gap-3 items-center">
                    <span className="text-sm text-gray-400 capitalize">{d}</span>
                    <input
                      type="time"
                      value={storeForm.business_hours[d].open}
                      onChange={(e) => setHour(d, 'open', e.target.value)}
                      className={inputCls}
                    />
                    <input
                      type="time"
                      value={storeForm.business_hours[d].close}
                      onChange={(e) => setHour(d, 'close', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                ))}
              </section>

              {/* Vacation Mode */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={storeForm.is_vacation_mode}
                  onChange={(e) => setStoreField('is_vacation_mode', e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-300">Vacation mode (store temporarily closed)</span>
              </label>

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