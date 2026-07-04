export default function OrderDetail() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Order Details (ORD-501)</h1>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center gap-2"><span>⬇</span> Download PDF Invoice</button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-bold mb-4 border-b pb-2">Items Ordered</h3>
        <div className="flex justify-between py-2"><span>Organic Tomatoes (50kg)</span><span>$125.00</span></div>
        <div className="flex justify-between py-2 border-b"><span>Avocados (20kg)</span><span>$180.00</span></div>
        <div className="flex justify-between py-2 font-bold text-lg mt-2"><span>Total</span><span>$305.00</span></div>
      </div>
    </div>
  );
}