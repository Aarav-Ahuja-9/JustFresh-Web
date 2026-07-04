"use client";

import { useState } from "react";
import Link from "next/link";
import { adminLogout } from "../actions";

interface AdminTabsProps {
  pendingOrdersCount: number;
  inventoryContent: React.ReactNode;
  ordersContent: React.ReactNode;
  databaseContent: React.ReactNode;
  couponsContent: React.ReactNode;
}

export default function AdminTabs({ pendingOrdersCount, inventoryContent, ordersContent, databaseContent, couponsContent }: AdminTabsProps) {
  const [currentTab, setCurrentTab] = useState("inventory");

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your inventory and fulfill incoming orders.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto overflow-hidden">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex gap-1 w-full sm:w-auto overflow-x-auto hide-scrollbar whitespace-nowrap">
            <button 
              onClick={() => setCurrentTab('inventory')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${currentTab === 'inventory' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              Inventory
            </button>
            <button 
              onClick={() => setCurrentTab('orders')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${currentTab === 'orders' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              Orders
              {pendingOrdersCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {pendingOrdersCount} NEW
                </span>
              )}
            </button>
            <button 
              onClick={() => setCurrentTab('coupons')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${currentTab === 'coupons' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              Coupons
            </button>
            <button 
              onClick={() => setCurrentTab('database')}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${currentTab === 'database' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              Database
            </button>
          </div>

          <form action={adminLogout}>
            <button className="bg-red-50 text-red-600 border border-red-100 px-5 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm">
              Logout
            </button>
          </form>
        </div>
      </div>
      
      {currentTab === 'inventory' && inventoryContent}
      {currentTab === 'orders' && ordersContent}
      {currentTab === 'coupons' && couponsContent}
      {currentTab === 'database' && databaseContent}
    </>
  );
}
