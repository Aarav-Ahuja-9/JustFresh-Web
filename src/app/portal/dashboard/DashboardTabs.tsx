"use client";

import { useState } from "react";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

interface DashboardTabsProps {
  userName: string;
  ordersContent: React.ReactNode;
  settingsContent: React.ReactNode;
  addressesContent: React.ReactNode;
}

export default function DashboardTabs({ userName, ordersContent, settingsContent, addressesContent }: DashboardTabsProps) {
  const [currentTab, setCurrentTab] = useState("orders");

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back, {userName}!</h1>
          <p className="text-gray-500 font-medium mt-1">View your order history and manage your account.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/portal/shop" 
            className="px-6 py-2.5 rounded-xl font-bold transition-all bg-emerald-600 text-white shadow-md hover:bg-emerald-700 text-sm"
          >
            Continue Shopping
          </Link>
          <SignOutButton />
        </div>
      </div>

      <div className="flex gap-2 relative z-10 px-4 md:pl-6 overflow-x-auto hide-scrollbar whitespace-nowrap">
        <button 
          onClick={() => setCurrentTab('orders')}
          className={`px-6 py-3 font-bold rounded-t-xl transition-colors border-b-0 ${currentTab === 'orders' ? 'bg-white text-slate-900 border-t border-x border-gray-200 relative top-[1px]' : 'bg-transparent text-gray-500 hover:text-slate-800 hover:bg-gray-200/50 border border-transparent'}`}
        >
          My Orders
        </button>
        <button 
          onClick={() => setCurrentTab('settings')}
          className={`px-6 py-3 font-bold rounded-t-xl transition-colors border-b-0 ${currentTab === 'settings' ? 'bg-white text-slate-900 border-t border-x border-gray-200 relative top-[1px]' : 'bg-transparent text-gray-500 hover:text-slate-800 hover:bg-gray-200/50 border border-transparent'}`}
        >
          Settings
        </button>
        <button 
          onClick={() => setCurrentTab('addresses')}
          className={`px-6 py-3 font-bold rounded-t-xl transition-colors border-b-0 ${currentTab === 'addresses' ? 'bg-white text-slate-900 border-t border-x border-gray-200 relative top-[1px]' : 'bg-transparent text-gray-500 hover:text-slate-800 hover:bg-gray-200/50 border border-transparent'}`}
        >
          Addresses
        </button>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative z-0">
        {currentTab === 'orders' && ordersContent}
        {currentTab === 'settings' && settingsContent}
        {currentTab === 'addresses' && addressesContent}
      </div>
    </>
  );
}
