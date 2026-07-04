import Link from "next/link";

export default function AdminOrders() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Master Orders List</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr><th className="p-4">Order ID</th><th className="p-4">Client</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr><td className="p-4">ORD-501</td><td className="p-4">Metro Market Corp</td><td className="p-4">$1,250.00</td><td className="p-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">Pending</span></td><td className="p-4"><Link href="/admin/orders/ORD-501" className="text-blue-600 hover:underline">View</Link></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}