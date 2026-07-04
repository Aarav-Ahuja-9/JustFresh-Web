export default function PendingApprovals() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Pending Registrations</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr><th className="p-4">Business Name</th><th className="p-4">Tax ID</th><th className="p-4">Date Applied</th><th className="p-4">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr><td className="p-4">Fresh Eats Diner</td><td className="p-4">TAX-889012</td><td className="p-4">Oct 14, 2026</td><td className="p-4"><button className="text-green-600 font-bold hover:underline">Approve</button> | <button className="text-red-600 font-bold hover:underline">Reject</button></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}