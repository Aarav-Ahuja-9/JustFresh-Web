export const dynamic = 'force-dynamic';
export default function Invoices() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Accounts Receivable Ledger</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr><th className="p-4">Invoice #</th><th className="p-4">Client</th><th className="p-4">Amount</th><th className="p-4">Due Date</th><th className="p-4">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr><td className="p-4">INV-1001</td><td className="p-4">Metro Market Corp</td><td className="p-4">$1,250.00</td><td className="p-4">Nov 14, 2026</td><td className="p-4"><span className="text-yellow-600 font-bold">Unpaid</span></td></tr>
            <tr><td className="p-4">INV-1000</td><td className="p-4">GreenEats</td><td className="p-4">$840.00</td><td className="p-4">Oct 10, 2026</td><td className="p-4"><span className="text-green-600 font-bold">Paid</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
