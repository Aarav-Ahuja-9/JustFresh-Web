export default function ClientProfile() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Client Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl space-y-4">
        <div><label className="block text-sm font-medium mb-1">Business Name</label><input type="text" className="w-full border rounded p-2 bg-gray-50" readOnly value="Metro Market Corp" /></div>
        <div><label className="block text-sm font-medium mb-1">Credit Limit ($)</label><input type="number" className="w-full border rounded p-2" defaultValue="50000" /></div>
        <div><label className="block text-sm font-medium mb-1">Pricing Tier</label><select className="w-full border rounded p-2"><option>Tier A (Wholesale+)</option><option>Tier B (Standard)</option></select></div>
        <button type="button" className="bg-green-600 text-white font-bold py-2 px-4 rounded">Update Profile</button>
      </div>
    </div>
  );
}