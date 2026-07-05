export const dynamic = 'force-dynamic';
export default function Statements() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Account Statements</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr><th className="p-4">Date</th><th className="p-4">Description</th><th className="p-4">Charge</th><th className="p-4">Payment</th><th className="p-4">Balance</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr><td className="p-4">Oct 14</td><td className="p-4">Order ORD-501</td><td className="p-4">$305.00</td><td className="p-4">-</td><td className="p-4">$305.00</td></tr>
            <tr><td className="p-4">Oct 10</td><td className="p-4">Payment Received</td><td className="p-4">-</td><td className="p-4">$1000.00</td><td className="p-4">$0.00</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
