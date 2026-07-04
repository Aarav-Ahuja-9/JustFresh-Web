"use client";

import { useCart } from "@/lib/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function Cart() {
  const { items, increaseQuantity, decreaseQuantity, removeItem } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {items.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven&apos;t added any fresh produce yet.</p>
                <Link 
                  href="/portal/shop" 
                  className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-colors inline-block"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-6 items-center border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                    <div className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <Image 
                        src={item.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4">
                      <div className="text-center sm:text-left">
                        <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                        <p className="text-gray-500">₹{item.price.toFixed(2)} / {item.unit}</p>
                      </div>
                      
                      <div className="flex flex-col items-center sm:items-end gap-3">
                        <div className="font-bold text-xl text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                            <button 
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={item.quantity === 1}
                              className={`w-10 h-10 flex items-center justify-center font-bold text-lg ${
                                item.quantity === 1 ? "bg-gray-50 text-gray-300" : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              -
                            </button>
                            <span className="w-10 text-center font-semibold">{item.quantity}</span>
                            <button 
                              onClick={() => increaseQuantity(item.id)}
                              className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold text-lg"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                            aria-label="Remove item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span className="font-semibold text-gray-900">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-6 text-gray-600">
                <span>Delivery</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-2xl border-t border-gray-100 pt-6 mb-8 text-gray-900">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              {items.length === 0 ? (
                <button disabled className="block text-center w-full bg-slate-300 text-white font-bold py-4 rounded-xl cursor-not-allowed text-lg">
                  Proceed to Checkout
                </button>
              ) : (
                <Link 
                  href="/portal/checkout"
                  className="block text-center w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-colors text-lg"
                >
                  Proceed to Checkout
                </Link>
              )}
              <div className="mt-4 text-center">
                <Link href="/portal/shop" className="text-green-600 font-semibold hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}