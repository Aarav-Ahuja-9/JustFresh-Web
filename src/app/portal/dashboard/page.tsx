export const dynamic = 'force-dynamic';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LocationPickerField from "@/components/LocationPickerField";
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { updateUserProfile, addAddress, deleteAddress, setDefaultAddress } from "./actions";
import DashboardTabs from "./DashboardTabs";
import AddAddressModal from "./AddAddressModal";
import DownloadInvoiceButton from "@/components/DownloadInvoiceButton";
import WriteReviewButton from "./WriteReviewButton";
export default async function PortalDashboard() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    redirect("/portal/login");
  }

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id }
  });

  const addresses = await db.address.findMany({
    where: { userId: session.user.id },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  const userName = session.user.name?.split(' ')[0] || "User";

  const ordersContent = (
    <>
      <div className="p-8 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-900">Your Orders ({orders.length})</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            <p className="mb-4">You haven&apos;t placed any orders yet.</p>
            <Link href="/portal/shop" className="text-emerald-600 font-bold hover:underline">
              Browse our fresh produce
            </Link>
          </div>
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
                  
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-black text-slate-900 text-xl">Order #{order.id.slice(-6).toUpperCase()}</h3>
                      <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border ${sColor}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-500 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                      <p className="flex gap-2"><span className="text-slate-400">📅</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="flex gap-2"><span className="text-slate-400">📍</span> Delivery to: {order.address}, {order.city}</p>
                      <p className="flex gap-2"><span className="text-slate-400">💳</span> {order.paymentMethod.replace("_", " ")}</p>
                      <p className="flex gap-2"><span className="text-slate-400">🕒</span> Slot: <span className="font-bold text-slate-700">{order.deliverySlot}</span></p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex flex-col items-end gap-3 min-w-[200px]">
                    <div className="text-slate-500 font-bold text-sm">Order Total</div>
                    <div className="text-3xl font-black text-emerald-600">₹{order.totalAmount.toFixed(2)}</div>
                    <DownloadInvoiceButton order={order} />
                  </div>

                </div>

                {/* Order Items */}
                <div className="bg-slate-50 border border-gray-100 rounded-2xl p-6 mt-4">
                  <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Items in this order</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                        <div className="relative w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          <Image 
                            src={item.product?.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"} 
                            alt={item.product?.name || "Product"} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-slate-800 text-sm">{item.product?.name || "Unknown Product"}</div>
                              <div className="text-xs font-semibold text-slate-500">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</div>
                            </div>
                            <WriteReviewButton 
                              productId={item.productId} 
                              productName={item.product?.name || "Product"} 
                              delivered={order.status === "DELIVERED"} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );

  const settingsContent = (
    <div className="p-8">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Account Settings</h2>
        <p className="text-slate-500 mb-8">View your personal account details.</p>
        
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <label className="block text-sm font-bold text-slate-500 mb-1">Full Name</label>
            <p className="text-lg font-bold text-slate-900">{session.user.name}</p>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <label className="block text-sm font-bold text-slate-500 mb-1">Email Address</label>
            <p className="text-lg font-bold text-slate-900 break-all">{session.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const addressesContent = (
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">Saved Addresses</h2>
          <AddAddressModal />
        </div>
        <p className="text-slate-500 mb-8">Manage your delivery addresses for a faster checkout experience.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {addresses.map((address) => (
            <div key={address.id} className={`p-6 rounded-2xl border ${address.isDefault ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 bg-white'} relative shadow-sm`}>
              {address.isDefault && (
                <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Default
                </div>
              )}
              <h3 className="font-black text-lg text-slate-900 mb-1">{address.label}</h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                {address.address}<br />
                {address.city} - {address.postalCode}<br />
                Phone: {address.phone}
              </p>
              
              <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100/50">
                {!address.isDefault && (
                  <form action={setDefaultAddress.bind(null, address.id)} className="flex-1">
                    <button type="submit" className="w-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2 rounded-lg transition-colors">
                      Set as Default
                    </button>
                  </form>
                )}
                <form action={deleteAddress.bind(null, address.id)} className={address.isDefault ? "w-full" : "flex-1"}>
                  <button type="submit" className="w-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-lg transition-colors border border-red-100">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <DashboardTabs 
          userName={userName}
          ordersContent={ordersContent}
          settingsContent={settingsContent}
          addressesContent={addressesContent}
        />
      </div>
    </div>
  );
}