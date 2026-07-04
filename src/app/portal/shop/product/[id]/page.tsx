export default function ProductDetail() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 h-64 bg-gray-200 rounded"></div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">Premium Item</h1>
          <p className="text-2xl text-green-600 font-bold mb-4">$2.50 / kg</p>
          <p className="text-gray-600 mb-6">Sourced from certified organic farms, strictly graded for wholesale consistency.</p>
          <div className="flex gap-4">
            <input type="number" defaultValue="100" className="w-24 border rounded p-2 text-lg" />
            <button className="bg-green-600 text-white px-6 py-2 rounded font-bold">Add to Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}