import Link from "next/link";

export default function PastOrders() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order History</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr><th className="p-4">Order ID</th><th className="p-4">Date</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr><td className="p-4">ORD-501</td><td className="p-4">Oct 14, 2026</td><td className="p-4">$305.00</td><td className="p-4"><span className="text-yellow-600 font-bold">Processing</span></td><td className="p-4"><Link href="/portal/orders/ORD-501" className="text-blue-600 hover:underline">View</Link></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}