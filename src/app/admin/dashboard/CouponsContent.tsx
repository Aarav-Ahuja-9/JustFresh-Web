import { db } from "@/lib/db";
import { addCoupon, deleteCoupon, toggleCoupon } from "../actions";

export default async function CouponsContent() {
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Create New Coupon</h2>
          <form action={addCoupon} className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-1">Code</label>
              <input name="code" type="text" placeholder="e.g. FRESH20" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-1">Type</label>
              <select name="discountType" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-1">Value</label>
              <input name="discountValue" type="number" step="0.01" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-500 mb-1">Min Order (₹)</label>
              <input name="minOrderAmount" type="number" defaultValue="0" step="0.01" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <button type="submit" className="bg-green-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-green-700 transition-colors">
              Create Coupon
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-black text-slate-900">Active & Past Coupons</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {coupons.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium">No coupons created yet.</div>
          ) : (
            coupons.map((coupon: any) => (
              <div key={coupon.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg font-mono">
                      {coupon.code}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-500">
                    Discount: {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} 
                    {' | '}Min Order: ₹{coupon.minOrderAmount} 
                    {' | '}Used: {coupon.usedCount} times
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={toggleCoupon.bind(null, coupon.id, coupon.isActive)}>
                    <button className="bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-xl hover:bg-slate-200 transition-colors text-xs">
                      {coupon.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </form>
                  <form action={deleteCoupon.bind(null, coupon.id)}>
                    <button className="bg-red-50 text-red-600 border border-red-100 font-bold py-2 px-4 rounded-xl hover:bg-red-100 transition-colors text-xs">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
