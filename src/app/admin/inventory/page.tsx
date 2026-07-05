export const dynamic = 'force-dynamic';
export default function AdminInventory() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <a href="/admin/inventory/add-product" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Product</a>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-4">SKU</th>
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock (kg)</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr><td className="p-4">PRD-001</td><td className="p-4">Organic Tomatoes</td><td className="p-4">Vegetables</td><td className="p-4">450</td><td className="p-4"><span className="text-green-600 font-bold">In Stock</span></td></tr>
            <tr><td className="p-4">PRD-002</td><td className="p-4">Red Onions</td><td className="p-4">Root Crops</td><td className="p-4">1200</td><td className="p-4"><span className="text-green-600 font-bold">In Stock</span></td></tr>
            <tr><td className="p-4">PRD-003</td><td className="p-4">Avocados (Hass)</td><td className="p-4">Fruits</td><td className="p-4">15</td><td className="p-4"><span className="text-red-600 font-bold">Low Stock</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
