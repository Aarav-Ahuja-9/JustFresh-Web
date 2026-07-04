"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import LocationPickerField from "@/components/LocationPickerField";
import { addAddress } from "./actions";

export default function AddAddressModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await addAddress(formData);
      setIsOpen(false);
      toast.success("Address added successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
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
                  onClick={() => setIsOpen(false)} 
                  className="w-10 h-10 bg-white/40 hover:bg-white/80 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all shadow-sm border border-white/50 backdrop-blur-md"
                >
                  ✕
                </button>
                
                <button 
                  type="submit"
                  form="add-address-form"
                  disabled={isSubmitting}
                  className="w-10 h-10 bg-emerald-500/80 hover:bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold transition-all shadow-sm border border-white/50 backdrop-blur-md disabled:opacity-50"
                >
                  {isSubmitting ? "..." : "✓"}
                </button>
              </div>
            </div>
            
            <form id="add-address-form" onSubmit={handleSubmit} className="space-y-6">
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
                  <LocationPickerField />
                </div>
              </div>
            </form>
          </motion.div>
          </motion.div>
        )}
    </AnimatePresence>
  );

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
      >
        + Add a new address
      </button>
      {mounted ? createPortal(modalContent, document.body) : null}
    </>
  );
}
