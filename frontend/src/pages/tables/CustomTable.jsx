// src/components/CustomTable.jsx
export default function CustomTable({ columns, data }) {
  return (
    <div className="overflow-x-auto bg-gray-900 rounded-xl border border-gray-800 shadow-lg">
      <table className="w-full text-left text-gray-300">
        <thead className="bg-gray-800 text-gray-200 border-b border-gray-700">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="p-4 font-semibold">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-800/50 transition">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-4">
                    {/* Agar column me custom render function hai (jaise Button ke liye), toh wo chalega, warna direct data */}
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-6 text-center text-gray-500">
                Koi data nahi mila bhai! 📭
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}