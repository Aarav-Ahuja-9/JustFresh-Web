"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";

const CATEGORIES = ["All", "Vegetables", "Fruits", "Herbs", "Dairy"];

export default function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "All";
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    router.push(`?${params.toString()}`);
  }, [debouncedQuery, router, searchParams]);

  const handleCategoryClick = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${
              currentCategory === cat 
                ? "bg-slate-900 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat === "All" ? "All Produce" : cat}
          </button>
        ))}
      </div>
      
      <div className="relative w-full md:w-72">
        <input 
          type="text" 
          placeholder="Search produce..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-100 border-none px-5 py-3 rounded-full text-sm font-medium focus:ring-2 focus:ring-green-500 outline-none transition-shadow"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>
    </div>
  );
}
