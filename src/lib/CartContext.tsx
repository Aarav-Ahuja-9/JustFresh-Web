"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  unit: string;
  imageUrl?: string | null;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setQuantity: (product: Omit<CartItem, "quantity">, quantity: number) => void;
  increaseQuantity: (id: string | number) => void;
  decreaseQuantity: (id: string | number) => void;
  removeItem: (id: string | number) => void;
  getItemQuantity: (id: string | number) => number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const localData = localStorage.getItem('justfresh_cart');
      if (localData) {
        setItems(JSON.parse(localData));
      }
    } catch (e) {
      console.error("Failed to load cart from local storage", e);
    }
    setIsMounted(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('justfresh_cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const setQuantity = (product: Omit<CartItem, "quantity">, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== product.id);
      }
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const increaseQuantity = (id: string | number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: string | number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item && item.quantity === 1) return prev; // Cannot decrease below 1 using this function, must use remove
      return prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      );
    });
  };

  const removeItem = (id: string | number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getItemQuantity = (id: string | number) => {
    const item = items.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        openCart,
        closeCart,
        setQuantity,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        getItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
