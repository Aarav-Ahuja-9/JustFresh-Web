"use client";

import { useCart } from "@/lib/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, increaseQuantity, decreaseQuantity, removeItem } = useCart();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>      <AnimatePresence>
        {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "120%" }}
            animate={{ x: 0 }}
            exit={{ x: "120%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-4 right-4 h-[calc(100vh-32px)] w-[calc(100vw-32px)] sm:w-[400px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
              <button 
                onClick={closeCart}
                className="text-gray-500 hover:text-gray-800 bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                        <p className="text-green-600 font-semibold">₹{item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => decreaseQuantity(item.id)}
                            disabled={item.quantity === 1}
                            className={`w-8 h-8 flex items-center justify-center font-bold ${
                              item.quantity === 1 ? "bg-gray-50 text-gray-300" : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => increaseQuantity(item.id)}
                            className="w-8 h-8 flex items-center justify-center bg-white text-gray-700 hover:bg-gray-100 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 text-sm hover:underline ml-auto"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-semibold">Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
              </div>
              {items.length === 0 ? (
                <button disabled className="w-full bg-green-400 text-white py-4 rounded-xl font-bold text-lg cursor-not-allowed mb-4 text-center block">
                  Checkout Now
                </button>
              ) : (
                <Link 
                  href="/portal/checkout"
                  onClick={closeCart}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors mb-4 text-center block"
                >
                  Checkout Now
                </Link>
              )}
              <Link 
                href="/portal/cart"
                onClick={closeCart}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors text-center block"
              >
                View Full Cart
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
