export default function Spoilage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Spoilage & Write-Offs</h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl mb-8">
        <h2 className="text-xl font-bold mb-4">Log Spoilage</h2>
        <form className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Product</label><select className="w-full border rounded p-2"><option>Select Product...</option></select></div>
          <div><label className="block text-sm font-medium mb-1">Quantity to Write Off (Kg)</label><input type="number" className="w-full border rounded p-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Reason</label><input type="text" className="w-full border rounded p-2" placeholder="e.g., Rotten, Damaged in transit" /></div>
          <button type="button" className="bg-red-600 text-white font-bold py-2 px-4 rounded">Record Write-Off</button>
        </form>
      </div>
    </div>
  );
}