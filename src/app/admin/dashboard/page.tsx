export const dynamic = 'force-dynamic';
import { db } from "@/lib/db";
import { addProduct, deleteProduct, updateProductInventory, adminLogout, updateOrderStatus, deleteOrderPermanently, deleteAllProducts, deleteAllOrders, deleteAllUsers } from "../actions";
import Image from "next/image";
import AdminTabs from "./AdminTabs";
import LocationPicker from "@/components/LocationPicker";
import AdminCharts from "@/components/AdminCharts";
import AddProductModal from "./AddProductModal";
import DownloadInvoiceButton from "@/components/DownloadInvoiceButton";
import DownloadReportButton from "@/components/DownloadReportButton";
import CouponsContent from "./CouponsContent";

export default async function AdminDashboard() {

  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  const pendingOrdersCount = orders.filter((o: any) => o.status === 'PENDING').length;

  // 1. Calculate Daily Revenue for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const revenueMap: Record<string, number> = {};
  last7Days.forEach(d => revenueMap[d] = 0);

  let totalRevenue = 0;
  orders.forEach(order => {
    if (order.status !== 'CANCELLED') {
      totalRevenue += order.totalAmount;
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (revenueMap[dateStr] !== undefined) {
        revenueMap[dateStr] += order.totalAmount;
      }
    }
  });

  const revenueData = Object.keys(revenueMap).map(date => ({
    date: date.substring(5), // Show MM-DD
    revenue: revenueMap[date]
  }));

  // 2. Calculate Top Selling Products
  const productSales: Record<string, { name: string, sold: number }> = {};
  orders.forEach(order => {
    if (order.status !== 'CANCELLED') {
      order.items.forEach(item => {
        const prodName = item.product?.name || 'Unknown';
        if (!productSales[prodName]) {
          productSales[prodName] = { name: prodName, sold: 0 };
        }
        productSales[prodName].sold += item.quantity;
      });
    }
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5); // Top 5

  // 3. Low Stock Alerts
  const lowStockProducts = products.filter(p => p.stock < p.minStockLevel);

  const inventoryContent = (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-slate-900">Current Inventory ({products.length})</h2>
        <AddProductModal />
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <div className="p-10 text-center text-gray-500 font-medium">No products found. Add one!</div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-slate-50 transition-colors group">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-gray-200/50">
                    <Image 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-slate-900 text-lg">{product.name}</h3>
                      {product.isFeatured && (
                        <span className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-0.5 rounded-md uppercase tracking-wider">Featured</span>
                      )}
                    </div>
                    <p className="text-slate-500 font-bold bg-slate-100 inline-block px-3 py-1 rounded-lg">₹{product.price.toFixed(2)} / {product.unit}</p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-3">
                    <form action={updateProductInventory.bind(null, product.id)} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Stock</label>
                        <input name="stock" type="number" defaultValue={product.stock} className="w-14 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Min</label>
                        <input name="minStockLevel" type="number" defaultValue={product.minStockLevel} className="w-14 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white" />
                      </div>
                      <button type="submit" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ml-1">
                        Save
                      </button>
                    </form>

                    <form action={deleteProduct.bind(null, product.id)}>
                      <button type="submit" className="text-red-500 hover:text-white bg-red-50 hover:bg-red-500 px-4 py-2 rounded-xl transition-colors font-bold text-xs border border-red-100 w-full text-right sm:w-auto">
                        Delete Item
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

  const ordersContent = (
    <div className="space-y-8">
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-sm">
          <div className="flex items-start gap-4">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-red-800 text-lg mb-2">Low Stock Alerts</h3>
              <p className="text-red-700 text-sm mb-4">The following items are running low and need to be restocked immediately:</p>
              <div className="flex flex-wrap gap-2">
                {lowStockProducts.map(p => (
                  <span key={p.id} className="bg-white px-3 py-1 rounded-full text-xs font-bold text-red-600 border border-red-200">
                    {p.name}: {p.stock} {p.unit} left (Min: {p.minStockLevel})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black text-slate-900">₹{totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl">💰</div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Orders</p>
            <h3 className="text-3xl font-black text-slate-900">{orders.filter(o => o.status !== 'CANCELLED').length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">📦</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-slate-900">Sales Analytics</h2>
        <DownloadReportButton orders={orders} />
      </div>
      <AdminCharts revenueData={revenueData} topProducts={topProducts} />

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900">Customer Orders ({orders.length})</h2>
        </div>
        <div className="divide-y divide-gray-100">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">No orders have been placed yet.</div>
        ) : (
          orders.map((order) => {
            const statusColors: any = {
              PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
              PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
              SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
              DELIVERED: "bg-green-100 text-green-800 border-green-200",
              CANCELLED: "bg-red-100 text-red-800 border-red-200",
            };
            const sColor = statusColors[order.status] || statusColors.PENDING;

            return (
              <div key={order.id} className="p-8 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6">
                  
                  {/* Customer Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-black text-slate-900 text-xl">{order.firstName} {order.lastName}</h3>
                      <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border ${sColor}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-500 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                      <p className="flex gap-2"><span className="text-slate-400">✉️</span> {order.email}</p>
                      <p className="flex gap-2"><span className="text-slate-400">📍</span> {order.address}, {order.city} {order.postalCode}</p>
                      <p className="flex gap-2"><span className="text-slate-400">💳</span> {order.paymentMethod.replace("_", " ")}</p>
                      <p className="flex gap-2"><span className="text-slate-400">🕒</span> Slot: <span className="font-bold text-slate-700">{order.deliverySlot}</span></p>
                      {order.phone && <p className="flex gap-2"><span className="text-slate-400">📞</span> {order.phone}</p>}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col items-end gap-3 min-w-[200px]">
                    <div className="text-2xl font-black text-slate-900 mb-2">₹{order.totalAmount.toFixed(2)}</div>
                    <DownloadInvoiceButton order={order} />
                    
                    <div className="flex flex-wrap gap-2 justify-end w-full">
                      {order.status === 'PENDING' && (
                        <form action={updateOrderStatus.bind(null, order.id, 'PROCESSING')}>
                          <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-700 transition-colors text-xs w-full">
                            Mark Processing
                          </button>
                        </form>
                      )}
                      {order.status === 'PROCESSING' && (
                        <form action={updateOrderStatus.bind(null, order.id, 'SHIPPED')}>
                          <button className="bg-purple-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-purple-700 transition-colors text-xs w-full">
                            Mark Shipped
                          </button>
                        </form>
                      )}
                      {(order.status === 'SHIPPED' || order.status === 'PROCESSING') && (
                        <form action={updateOrderStatus.bind(null, order.id, 'DELIVERED')}>
                          <button className="bg-green-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-green-700 transition-colors text-xs w-full">
                            Mark Delivered
                          </button>
                        </form>
                      )}
                      {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                        <form action={updateOrderStatus.bind(null, order.id, 'CANCELLED')}>
                          <button className="bg-red-50 text-red-600 border border-red-100 font-bold py-2 px-4 rounded-xl hover:bg-red-100 transition-colors text-xs w-full mt-1">
                            Cancel Order
                          </button>
                        </form>
                      )}
                      <form action={deleteOrderPermanently.bind(null, order.id)}>
                        <button className="bg-red-600 text-white border border-red-700 font-bold py-2 px-4 rounded-xl hover:bg-red-700 transition-colors text-xs w-full mt-1">
                          Delete Permanently
                        </button>
                      </form>
                    </div>
                  </div>

                </div>

                {/* Order Items */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 mt-4">
                  <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Order Items</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl">
                        <div className="relative w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          <Image 
                            src={item.product?.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"} 
                            alt={item.product?.name || "Product"} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 text-sm">{item.product?.name || "Unknown Product"}</div>
                          <div className="text-xs font-semibold text-slate-500">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</div>
                        </div>
                        <div className="font-black text-slate-900 text-sm">
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Map Location */}
                  {order.latitude && order.longitude && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-slate-700">Exact Delivery Location</h4>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${order.latitude},${order.longitude}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          🗺️ Open in Google Maps
                        </a>
                      </div>
                      <div className="h-[250px] rounded-xl overflow-hidden shadow-inner border border-gray-100">
                        <LocationPicker 
                          readOnly 
                          defaultLocation={{ lat: order.latitude, lng: order.longitude }} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
    </div>
  );

  const databaseContent = (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-200">
      <h2 className="text-2xl font-black text-red-600 mb-2">Danger Zone</h2>
      <p className="text-gray-600 mb-8 font-medium">Warning: These actions will permanently erase data from the database. This cannot be undone.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-red-100 bg-red-50/30 p-6 rounded-2xl flex flex-col items-center text-center">
          <h3 className="font-bold text-lg text-slate-900 mb-2">Wipe Inventory</h3>
          <p className="text-sm text-gray-500 mb-6">Deletes all products and items from the shop.</p>
          <form action={deleteAllProducts} className="w-full mt-auto">
            <button className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors shadow-sm">
              Delete All Products
            </button>
          </form>
        </div>

        <div className="border border-red-100 bg-red-50/30 p-6 rounded-2xl flex flex-col items-center text-center">
          <h3 className="font-bold text-lg text-slate-900 mb-2">Wipe Orders</h3>
          <p className="text-sm text-gray-500 mb-6">Deletes all order history from the system permanently.</p>
          <form action={deleteAllOrders} className="w-full mt-auto">
            <button className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors shadow-sm">
              Delete All Orders
            </button>
          </form>
        </div>

        <div className="border border-red-100 bg-red-50/30 p-6 rounded-2xl flex flex-col items-center text-center">
          <h3 className="font-bold text-lg text-slate-900 mb-2">Wipe Users</h3>
          <p className="text-sm text-gray-500 mb-6">Deletes all registered user accounts and sessions.</p>
          <form action={deleteAllUsers} className="w-full mt-auto">
            <button className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors shadow-sm">
              Delete All Users
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <AdminTabs 
          pendingOrdersCount={pendingOrdersCount}
          inventoryContent={inventoryContent}
          ordersContent={ordersContent}
          databaseContent={databaseContent}
          couponsContent={<CouponsContent />}
        />
      </div>
    </div>
  );
}