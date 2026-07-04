export default function NewBatch() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Log New Batch</h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <form className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Farm Source</label><input type="text" className="w-full border rounded p-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Product</label><select className="w-full border rounded p-2"><option>Select Product...</option></select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Quantity (Kg)</label><input type="number" className="w-full border rounded p-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Expiry Date</label><input type="date" className="w-full border rounded p-2" /></div>
          </div>
          <button type="button" className="bg-green-600 text-white font-bold py-2 px-4 rounded">Log Batch</button>
        </form>
      </div>
    </div>
  );
}