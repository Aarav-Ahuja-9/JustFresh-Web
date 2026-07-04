"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addProduct } from "../actions";

export default function AddProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    // Add imagePreview (base64 string) as imageUrl
    if (imagePreview) {
      formData.set("imageUrl", imagePreview);
    }
    
    try {
      await addProduct(formData);
      setIsOpen(false);
      setImagePreview(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-slate-900 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
      >
        + Add Product
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white/40 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border-2 border-white/70 rounded-[2rem] p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900">Add New Product</h2>
                
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)} 
                    className="w-10 h-10 bg-white/40 hover:bg-white/80 rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all shadow-sm border border-white/50 backdrop-blur-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <button 
                    type="submit"
                    form="add-product-form"
                    disabled={isSubmitting}
                    className="w-10 h-10 bg-emerald-500/80 hover:bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold transition-all shadow-sm border border-white/50 backdrop-blur-md disabled:opacity-80"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="4" stroke="currentColor" className="w-5 h-5">
                      <motion.path
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M4.5 12.75l6 6 9-13.5" 
                        initial={{ pathLength: 1, opacity: 1 }}
                        animate={isSubmitting ? { pathLength: [0, 1, 1], opacity: [1, 1, 0] } : { pathLength: 1, opacity: 1 }}
                        transition={isSubmitting ? { duration: 1.2, repeat: Infinity, times: [0, 0.7, 1], ease: "easeInOut" } : { duration: 0.2 }}
                      />
                    </svg>
                  </button>
                </div>
              </div>
              
              <form id="add-product-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                  <input name="name" type="text" required className="w-full px-4 py-3 rounded-xl border border-white/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/30 hover:bg-white/50 transition-all" placeholder="e.g. Organic Tomatoes" />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹)</label>
                    <input name="price" type="number" step="0.01" required className="w-full px-4 py-3 rounded-xl border border-white/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/30 hover:bg-white/50 transition-all" placeholder="45.00" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Unit</label>
                    <input name="unit" type="text" required className="w-full px-4 py-3 rounded-xl border border-white/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/30 hover:bg-white/50 transition-all" placeholder="kg, lb, box" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Current Stock</label>
                    <input name="stock" type="number" defaultValue="0" min="0" required className="w-full px-4 py-3 rounded-xl border border-white/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/30 hover:bg-white/50 transition-all" placeholder="0" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Min Stock</label>
                    <input name="minStockLevel" type="number" defaultValue="10" min="0" required className="w-full px-4 py-3 rounded-xl border border-white/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white/30 hover:bg-white/50 transition-all" placeholder="10" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Product Image</label>
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                      isDragging 
                        ? "border-emerald-500 bg-emerald-50/50" 
                        : "border-slate-300/50 bg-white/30 hover:bg-white/50 hover:border-emerald-500"
                    }`}
                  >
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    
                    {imagePreview ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-bold flex items-center gap-2">
                            <span>🔄</span> Replace Image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-white/70 text-2xl">
                          📷
                        </div>
                        <p className="font-bold text-slate-700 mb-1">Click or drag image here</p>
                        <p className="text-xs text-slate-500">Supports JPG, PNG (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2 p-4 border border-white/50 rounded-xl bg-white/20">
                  <input type="checkbox" name="isFeatured" id="isFeatured" className="w-5 h-5 accent-emerald-600 rounded" />
                  <label htmlFor="isFeatured" className="text-sm font-bold text-slate-700 cursor-pointer select-none">Feature on Homepage</label>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
