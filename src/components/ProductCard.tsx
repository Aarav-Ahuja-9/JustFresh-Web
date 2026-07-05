"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";

type ProductCardProps = {
  product: {
    id: string | number;
    name: string;
    price: number;
    unit: string;
    imageUrl?: string | null;
    averageRating?: number;
    reviewCount?: number;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const { setQuantity, increaseQuantity, decreaseQuantity, getItemQuantity, openCart } = useCart();
  
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    setQuantity(product, 1);
    openCart();
  };

  const handleIncrease = () => {
    increaseQuantity(product.id);
  };

  const handleDecrease = () => {
    decreaseQuantity(product.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="relative h-48 w-full bg-slate-100">
        <Image src={product.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"} alt={product.name} fill sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-slate-800 text-lg mb-1">{product.name}</h3>
        
        {product.reviewCount !== undefined && product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-1">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-xs font-bold text-slate-700">{product.averageRating?.toFixed(1)}</span>
            <span className="text-xs font-medium text-slate-400">({product.reviewCount} reviews)</span>
          </div>
        )}
        {product.reviewCount === 0 && (
          <div className="text-xs font-medium text-slate-400 mb-1">No reviews yet</div>
        )}

        <p className="text-green-600 font-semibold mb-4 mt-1">₹{product.price.toFixed(2)} / {product.unit}</p>
        
        <div className="mt-auto h-[40px]">
          <AnimatePresence mode="wait">
            {quantity === 0 ? (
              <motion.button 
                key="add"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                onClick={handleAddToCart}
                className="block w-full h-[40px] bg-slate-900 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Add to Cart
              </motion.button>
            ) : (
              <motion.div 
                key="cart-actions"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="flex gap-2 h-[40px]"
              >
                <div className="w-1/2">
                  <button 
                    className="w-full h-full bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-lg font-medium text-sm flex items-center justify-center transition-all duration-300 ease-in-out"
                    onClick={() => setQuantity(product, 0)}
                  >
                    Remove
                  </button>
                </div>
                <div className="w-1/2 flex items-center justify-between border border-green-600 rounded-lg overflow-hidden bg-white">
                  <button 
                    onClick={handleDecrease}
                    disabled={quantity === 1}
                    className={`w-10 h-full font-bold flex items-center justify-center transition-colors ${
                      quantity === 1 
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    -
                  </button>
                  <motion.span 
                    key={quantity}
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="font-bold text-slate-800 text-sm"
                  >
                    {quantity}
                  </motion.span>
                  <button 
                    onClick={handleIncrease}
                    className="w-10 h-full bg-green-600 text-white hover:bg-green-700 font-bold flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
