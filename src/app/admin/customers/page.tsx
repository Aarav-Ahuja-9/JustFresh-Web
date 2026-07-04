import Link from "next/link";

export default function AdminCustomers() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Business Clients</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr><th className="p-4">Client ID</th><th className="p-4">Business Name</th><th className="p-4">Credit Tier</th><th className="p-4">Status</th><th className="p-4">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr><td className="p-4">CLI-101</td><td className="p-4">Metro Market Corp</td><td className="p-4">Tier A (Net-30)</td><td className="p-4"><span className="text-green-600 font-bold">Active</span></td><td className="p-4"><Link href="/admin/customers/CLI-101" className="text-blue-600 hover:underline">View</Link></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}