"use client";

import { useCart } from "@/lib/CartContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import LocationPicker from "@/components/LocationPicker";

import { authClient } from "@/lib/auth-client";

import { placeOrder, validateCoupon } from "./actions";
import { addAddress } from "../dashboard/actions";

export default function Checkout() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [profile, setProfile] = useState<any>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [selectedAddressId, setSelectedAddressId] = useState<string>("custom");
  const [customAddress, setCustomAddress] = useState({ address: "", city: "", postalCode: "", phone: "", lat: 0, lng: 0 });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressLocation, setNewAddressLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (session?.user) {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          if (data.addresses && data.addresses.length > 0) {
            const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
            setSelectedAddressId(defaultAddr.id);
          }
        });
    }
  }, [session]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    discountAmount = appliedCoupon.discountType === 'PERCENTAGE' 
      ? (total * appliedCoupon.discountValue) / 100 
      : appliedCoupon.discountValue;
  }
  const finalTotal = Math.max(0, total - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await validateCoupon(couponCode, total);
      if (res.error) {
        setCouponError(res.error);
        setAppliedCoupon(null);
      } else if (res.coupon) {
        setAppliedCoupon(res.coupon);
        toast.success("Coupon applied successfully!");
      }
    } catch (e) {
      setCouponError("Failed to apply coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
      
    const isCustom = selectedAddressId === 'custom';
    let phone = "";
    let lat = "";
    let lng = "";

    if (isCustom) {
      phone = customAddress.phone;
      lat = customAddress.lat.toString();
      lng = customAddress.lng.toString();
    } else if (profile?.addresses) {
      const addr = profile.addresses.find((a: any) => a.id === selectedAddressId);
      if (addr) {
        formData.set('address', addr.address);
        formData.set('city', addr.city);
        formData.set('postalCode', addr.postalCode);
        phone = addr.phone;
        if (addr.latitude) lat = addr.latitude.toString();
        if (addr.longitude) lng = addr.longitude.toString();
      }
    }

    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const address = formData.get("address");
    const city = formData.get("city");
    const postalCode = formData.get("postalCode");

    if (!firstName) { toast.error("First Name is required"); setIsSubmitting(false); return; }
    if (!lastName) { toast.error("Last Name is required"); setIsSubmitting(false); return; }
    if (!address) { toast.error("Street Address is required"); setIsSubmitting(false); return; }
    if (!city) { toast.error("City is required"); setIsSubmitting(false); return; }
    if (!postalCode) { toast.error("Postal Code is required"); setIsSubmitting(false); return; }
    if (!phone) { toast.error("Mobile Number is required"); setIsSubmitting(false); return; }

    formData.append("phone", phone);
    if (lat && lng) {
      formData.append("latitude", lat);
      formData.append("longitude", lng);
    }

    const result = await placeOrder(formData, items, appliedCoupon?.code || null);

    setIsSubmitting(false);

    if (result.error) {
      setErrorMsg(result.error);
    } else if (result.success) {
      setIsSuccess(true);
      clearCart?.();
    }
  };

  const handleAddAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (newAddressLocation.lat && newAddressLocation.lng) {
      formData.append("latitude", newAddressLocation.lat.toString());
      formData.append("longitude", newAddressLocation.lng.toString());
    }
    
    try {
      await addAddress(formData);
      setIsAddingAddress(false);
      toast.success("Address added successfully!");
      
      // Refresh profile to get the new address
      const res = await fetch("/api/profile");
      const data = await res.json();
      setProfile(data);
      
      // Auto-select the newly added address
      if (data.addresses && data.addresses.length > 0) {
        setSelectedAddressId(data.addresses[data.addresses.length - 1].id);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add address");
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Verifying your secure session...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl shadow-green-900/10 max-w-lg w-full border border-white"
        >
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Login Required</h2>
          <p className="text-slate-500 mb-8 text-lg font-medium">
            You must be signed in to your account to place a secure order with JustFresh Agro.
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              href="/portal/login?redirect=/portal/checkout" 
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 hover:shadow-xl transition-all active:scale-95 text-lg"
            >
              Sign In to Checkout
            </Link>
            <Link 
              href="/portal/cart" 
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mt-2"
            >
              Return to Cart
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl shadow-green-900/10 max-w-lg w-full text-center border border-white"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-28 h-28 bg-gradient-to-tr from-green-400 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 text-6xl shadow-lg shadow-green-500/30"
          >
            ✓
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-black text-slate-900 mb-4 tracking-tight"
          >
            Order Confirmed!
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-500 mb-10 text-lg font-medium"
          >
            Thank you for your purchase. Your farm-fresh produce is being prepared and will be delivered shortly.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              href="/portal/shop"
              className="block w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-600/20 transition-all active:scale-95 text-lg"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some items before checking out.</p>
        <Link href="/portal/shop" className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      <header className="bg-white sticky top-0 z-20 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight text-slate-900">
            Just<span className="text-green-600">Fresh</span>
          </Link>
          <Link href="/portal/cart" className="text-sm font-semibold text-slate-600 hover:text-green-600 transition-colors">
            Back to Cart
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <h1 className="text-3xl font-black text-slate-900 mb-8">Secure Checkout</h1>
        
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-10"
        >
          
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/50 border border-white p-8 sm:p-10">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">1</span>
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                  <input name="firstName" type="text" defaultValue={session?.user?.name?.split(' ')[0] || ''} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-gray-50/50 hover:bg-gray-50 transition-all" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                  <input name="lastName" type="text" defaultValue={session?.user?.name?.split(' ').slice(1).join(' ') || ''} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-gray-50/50 hover:bg-gray-50 transition-all" placeholder="Doe" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input name="email" type="email" defaultValue={session?.user?.email || ''} readOnly className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none bg-gray-100 text-gray-500 cursor-not-allowed" placeholder="john@example.com" />
                  <p className="text-xs text-green-600 mt-2 font-semibold">✓ Verified with your account</p>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full mb-10"></div>

              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">2</span>
                Shipping Details
              </h2>

              {profile?.addresses?.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-slate-700">Saved Addresses</label>
                    <button 
                      type="button"
                      onClick={() => setIsAddingAddress(true)}
                      className="text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      + Add a new address
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.addresses.map((addr: any) => (
                      <label key={addr.id} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-emerald-300'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <input type="radio" name="addressSelection" value={addr.id} checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="text-emerald-600 focus:ring-emerald-500" />
                            <span className="font-bold text-slate-900">{addr.label}</span>
                          </div>
                          {addr.isDefault && <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Default</span>}
                        </div>
                        <p className="text-sm text-slate-600 ml-6">{addr.address}, {addr.city} {addr.postalCode}</p>
                      </label>
                    ))}
                    <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2 ${selectedAddressId === 'custom' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-white hover:border-emerald-300'}`}>
                      <input type="radio" name="addressSelection" value="custom" checked={selectedAddressId === 'custom'} onChange={() => setSelectedAddressId('custom')} className="text-emerald-600 focus:ring-emerald-500" />
                      <span className="font-bold text-slate-900">Use a different address</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Street Address</label>
                  <input name="address" type="text" 
                    value={selectedAddressId === 'custom' ? customAddress.address : profile?.addresses?.find((a:any) => a.id === selectedAddressId)?.address || ""}
                    onChange={(e) => setCustomAddress({...customAddress, address: e.target.value})}
                    readOnly={selectedAddressId !== 'custom'}
                    className={`w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all ${selectedAddressId !== 'custom' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50/50 hover:bg-gray-50'}`} placeholder="123 Farm Lane" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                  <input name="city" type="text" 
                    value={selectedAddressId === 'custom' ? customAddress.city : profile?.addresses?.find((a:any) => a.id === selectedAddressId)?.city || ""}
                    onChange={(e) => setCustomAddress({...customAddress, city: e.target.value})}
                    readOnly={selectedAddressId !== 'custom'}
                    className={`w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all ${selectedAddressId !== 'custom' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50/50 hover:bg-gray-50'}`} placeholder="Metropolis" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Postal Code</label>
                  <input name="postalCode" type="text" 
                    value={selectedAddressId === 'custom' ? customAddress.postalCode : profile?.addresses?.find((a:any) => a.id === selectedAddressId)?.postalCode || ""}
                    onChange={(e) => setCustomAddress({...customAddress, postalCode: e.target.value})}
                    readOnly={selectedAddressId !== 'custom'}
                    className={`w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all ${selectedAddressId !== 'custom' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50/50 hover:bg-gray-50'}`} placeholder="10001" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                  <input name="temp_phone" type="tel" 
                    value={selectedAddressId === 'custom' ? customAddress.phone : profile?.addresses?.find((a:any) => a.id === selectedAddressId)?.phone || ""}
                    onChange={(e) => setCustomAddress({...customAddress, phone: e.target.value})}
                    readOnly={selectedAddressId !== 'custom'}
                    className={`w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all ${selectedAddressId !== 'custom' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50/50 hover:bg-gray-50'}`} placeholder="Your 10-digit mobile number" />
                </div>

                {selectedAddressId === 'custom' && (
                  <div className="md:col-span-2 mt-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pin Exact Delivery Location</label>
                    <LocationPicker 
                      onLocationSelect={(lat, lng) => setCustomAddress({...customAddress, lat, lng})}
                    />
                  </div>
                )}
                
                {selectedAddressId !== 'custom' && profile?.addresses?.find((a:any) => a.id === selectedAddressId)?.latitude && (
                  <div className="md:col-span-2 mt-4 opacity-75">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Saved Map Location</label>
                    <LocationPicker 
                      readOnly={true}
                      defaultLocation={{
                        lat: profile.addresses.find((a:any) => a.id === selectedAddressId).latitude,
                        lng: profile.addresses.find((a:any) => a.id === selectedAddressId).longitude
                      }}
                      onLocationSelect={() => {}}
                    />
                  </div>
                )}
                
                <div className="md:col-span-2 mt-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Delivery Slot</label>
                  <div className="relative">
                    <select name="deliverySlot" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 bg-gray-50/50 hover:bg-gray-50 transition-all appearance-none cursor-pointer font-medium text-slate-800">
                      <option value="ANY">Any Time (Standard)</option>
                      <option value="9AM_11AM">9:00 AM - 11:00 AM</option>
                      <option value="11AM_1PM">11:00 AM - 1:00 PM</option>
                      <option value="1PM_3PM">1:00 PM - 3:00 PM</option>
                      <option value="3PM_5PM">3:00 PM - 5:00 PM</option>
                      <option value="5PM_7PM">5:00 PM - 7:00 PM</option>
                      <option value="7PM_9PM">7:00 PM - 9:00 PM</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full mb-10"></div>

              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">3</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 gap-4 mb-10">
                <label className="flex items-center p-5 border-2 border-transparent bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all has-[:checked]:bg-green-50 has-[:checked]:border-green-500 group">
                  <input type="radio" name="paymentMethod" value="COD" className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300" required defaultChecked />
                  <span className="ml-4 flex flex-col">
                    <span className="font-bold text-slate-800 group-has-[:checked]:text-green-800">Pay on Delivery</span>
                    <span className="text-sm font-medium text-slate-500 mt-1">Pay via Cash or UPI when your order arrives</span>
                  </span>
                </label>
              </div>

              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 p-5 rounded-2xl font-bold mb-8 border border-red-100 text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  {errorMsg}
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-600/20 transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:active:scale-100 text-lg flex items-center justify-center overflow-hidden relative group"
              >
                {isSubmitting ? (
                  <span className="animate-pulse flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-between w-full px-4">
                    <span>Place Secure Order</span>
                    <span className="bg-white/20 py-1 px-3 rounded-xl">₹{total.toFixed(2)}</span>
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-white p-8 sticky top-28">
              <h2 className="text-2xl font-black text-slate-900 mb-8">Order Summary</h2>
              
              <div className="flex flex-col gap-6 mb-8 max-h-[22rem] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-5 group">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                      <Image 
                        src={item.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"} 
                        alt={item.name} 
                        fill 
                        sizes="64px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 line-clamp-1 text-lg leading-tight mb-1">{item.name}</h4>
                      <p className="text-sm font-medium text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded-md">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-black text-lg text-slate-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                {!appliedCoupon ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter Promo Code" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                      />
                      <button 
                        type="button" 
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="bg-green-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && <p className="text-red-500 text-xs font-bold px-1">{couponError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-green-800">Code applied: {appliedCoupon.code}</span>
                      <span className="text-xs font-medium text-green-600">
                        {appliedCoupon.discountType === 'PERCENTAGE' 
                          ? `${appliedCoupon.discountValue}% OFF` 
                          : `₹${appliedCoupon.discountValue} OFF`}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex justify-between mb-3 text-sm font-semibold text-slate-600">
                  <span>Subtotal</span>
                  <span className="text-slate-900">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-3 text-sm font-semibold text-slate-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Free Delivery</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between mb-5 text-sm font-semibold text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>- ₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {!appliedCoupon && <div className="mb-5"></div>}
                
                <div className="h-px bg-slate-200 w-full mb-5"></div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-500">Total</span>
                  <span className="font-black text-3xl text-slate-900">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isAddingAddress && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsAddingAddress(false)}></div>
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white/40 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border-2 border-white/70 rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900">Add New Address</h2>
                
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddingAddress(false)} 
                    className="w-10 h-10 bg-white/40 hover:bg-white/80 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all shadow-sm border border-white/50 backdrop-blur-md"
                  >
                    ✕
                  </button>
                  
                  <button 
                    type="submit"
                    form="checkout-add-address-form"
                    className="w-10 h-10 bg-emerald-500/80 hover:bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold transition-all shadow-sm border border-white/50 backdrop-blur-md"
                  >
                    ✓
                  </button>
                </div>
              </div>
              
              <form id="checkout-add-address-form" onSubmit={handleAddAddressSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Label (e.g. Home, Office)</label>
                    <input 
                      type="text" 
                      name="label" 
                      placeholder="Home" 
                      required
                      className="w-full px-5 py-4 rounded-2xl border border-white/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/30 hover:bg-white/50 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Delivery Address</label>
                    <input 
                      type="text" 
                      name="address" 
                      placeholder="123 Main St, Apt 4B" 
                      required
                      className="w-full px-5 py-4 rounded-2xl border border-white/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/30 hover:bg-white/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                    <input 
                      type="text" 
                      name="city" 
                      placeholder="Mumbai" 
                      required
                      className="w-full px-5 py-4 rounded-2xl border border-white/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/30 hover:bg-white/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Postal Code</label>
                    <input 
                      type="text" 
                      name="postalCode" 
                      placeholder="400001" 
                      required
                      className="w-full px-5 py-4 rounded-2xl border border-white/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/30 hover:bg-white/50 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone" 
                      placeholder="+91 98765 43210" 
                      required
                      className="w-full px-5 py-4 rounded-2xl border border-white/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/30 hover:bg-white/50 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pin Exact Delivery Location</label>
                    <LocationPicker 
                      onLocationSelect={(lat, lng) => setNewAddressLocation({lat, lng})}
                    />
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
