export default function AddProduct() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Product</h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <form className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Product Name</label><input type="text" className="w-full border rounded p-2" /></div>
          <div><label className="block text-sm font-medium mb-1">Category</label><select className="w-full border rounded p-2"><option>Vegetables</option><option>Fruits</option><option>Root Crops</option></select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Price per Kg ($)</label><input type="number" className="w-full border rounded p-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Initial Stock (Kg)</label><input type="number" className="w-full border rounded p-2" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Description</label><textarea className="w-full border rounded p-2" rows={4}></textarea></div>
          <button type="button" className="bg-green-600 text-white font-bold py-2 px-4 rounded">Save Product</button>
        </form>
      </div>
    </div>
  );
}