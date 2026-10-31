// src/components/CustomForm.jsx
export default function CustomForm({ title, fields, formData, onChange, onSubmit, submitText, loading }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4 text-gray-100">{title}</h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="text-sm font-medium text-gray-300 mb-1">{field.label}</label>
            <input 
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={onChange}
              placeholder={field.placeholder}
              required={field.required}
              className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        ))}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Process ho raha hai... ⏳" : submitText}
        </button>
      </form>
    </div>
  );
}