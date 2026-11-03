import React, { useState, useEffect } from 'react';
import { api, getApiError } from '../../../api/https';

const AddProduct = () => {
  const [categories, setCategories] = useState([]); // Poora tree jo backend se aaya
  const [selectedMainId, setSelectedMainId] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); // Aakhri ID jo product ke sath save hogi

  // Other form fields state (jaise title, price, etc.)
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Component load hote hi categories ka tree fetch karo
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/vendor/categories');
        
        // Yeh aapke response.data.data structure ke mutabik set ho raha hai
        if (response.data.status === 'Success') {
          setCategories(response.data.data);
        }
      } catch (error) {
        setErrorMessage(getApiError(error));
      }
    };
    fetchCategories();
  }, []);

  // 2. Main category select hone par uske children nikalna
  const mainCategory = categories.find(cat => cat.id === Number(selectedMainId));
  const subCategories = mainCategory ? mainCategory.recursive_children : [];

  // 3. Sub category select hone par uske andar ke sub-sub-categories nikalna
  const subCategory = subCategories.find(cat => cat.id === Number(selectedSubId));
  const subSubCategories = subCategory ? subCategory.recursive_children : [];

  // 4. Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validation: Check karein ki aakhri sub-sub category select ki ya nahi
    if (!selectedCategoryId) {
      setErrorMessage('Please select a final sub-sub-category.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: productName,
        price: price,
        category_id: selectedCategoryId, // Yeh aakhri wali ID backend par jayegi
      };

      const response = await api.post('/vendor/products', payload);
      
      if (response.data.status === 'Success') {
        setSuccessMessage('Product added successfully!');
        // Form reset kar sakte hain
        setProductName('');
        setPrice('');
        setSelectedMainId('');
        setSelectedSubId('');
        setSelectedCategoryId('');
      }
    } catch (error) {
      setErrorMessage(getApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>

      {errorMessage && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMessage}</div>}
      {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input 
            type="text" 
            value={productName} 
            onChange={(e) => setProductName(e.target.value)} 
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        {/* Product Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="w-full border p-2 rounded mt-1"
            required
          />
        </div>

        {/* 1. Main Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Main Category</label>
          <select 
            value={selectedMainId} 
            onChange={(e) => {
              setSelectedMainId(e.target.value);
              setSelectedSubId(''); // Reset sub
              setSelectedCategoryId(''); // Reset final
            }}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="">Select Main Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* 2. Sub Category Dropdown (Tabhi dikhega jab main category chuni ho) */}
        {subCategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sub Category</label>
            <select 
              value={selectedSubId} 
              onChange={(e) => {
                setSelectedSubId(e.target.value);
                setSelectedCategoryId(''); // Reset final
              }}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* 3. Sub-Sub Category Dropdown (Asli category jisme product jayega) */}
        {subSubCategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Sub-Sub Category (Target)</label>
            <select 
              value={selectedCategoryId} 
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="">Select Final Category</option>
              {subSubCategories.map((subSub) => (
                <option key={subSub.id} value={subSub.id}>{subSub.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Saving...' : 'Save Product'}
        </button>

      </form>
    </div>
  );
};

export default AddProduct;