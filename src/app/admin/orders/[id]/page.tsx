export const dynamic = 'force-dynamic';
export default function AdminOrderDetail() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Order Detail</h1>
        <div className="space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Print Packing Slip</button>
          <button className="bg-green-600 text-white px-4 py-2 rounded">Mark Dispatched</button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <p><strong>Client:</strong> Metro Market Corp</p>
        <p><strong>Status:</strong> Pending</p>
        <p><strong>Total:</strong> $1,250.00</p>
        <hr className="my-4" />
        <h3 className="font-bold mb-2">Items</h3>
        <ul className="list-disc pl-5">
          <li>500kg Organic Tomatoes</li>
          <li>100kg Avocados</li>
        </ul>
      </div>
    </div>
  );
}
