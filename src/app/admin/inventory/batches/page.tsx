export const dynamic = 'force-dynamic';
export default function Batches() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Incoming Farm Batches</h1>
        <a href="/admin/inventory/batches/new" className="bg-green-600 text-white px-4 py-2 rounded">Log New Batch</a>
      </div>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr><th className="p-4">Batch ID</th><th className="p-4">Farm Source</th><th className="p-4">Product</th><th className="p-4">Quantity (kg)</th><th className="p-4">Date Received</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr><td className="p-4">BCH-992</td><td className="p-4">Valley Farms</td><td className="p-4">Carrots</td><td className="p-4">800</td><td className="p-4">Oct 12, 2026</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
