export const dynamic = 'force-dynamic';
export default function Dispatch() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dispatch & Route Planner</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Pending Deliveries (Today)</h2>
          <ul className="space-y-2">
            <li className="p-3 border rounded">ORD-501 (Metro Market) - Zone A</li>
            <li className="p-3 border rounded">ORD-502 (GreenEats) - Zone B</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Assign to Van</h2>
          <form className="space-y-4">
            <select className="w-full border rounded p-2"><option>Van 1 (Driver: John)</option><option>Van 2 (Driver: Mike)</option></select>
            <button type="button" className="w-full bg-blue-600 text-white py-2 rounded">Generate Manifest</button>
          </form>
        </div>
      </div>
    </div>
  );
}
