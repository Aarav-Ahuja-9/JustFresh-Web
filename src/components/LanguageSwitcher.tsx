"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState("en");

  useEffect(() => {
    // Read current locale from cookie
    const cookies = document.cookie.split("; ");
    const localeCookie = cookies.find((c) => c.startsWith("NEXT_LOCALE="));
    if (localeCookie) {
      setCurrentLocale(localeCookie.split("=")[1]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    setCurrentLocale(newLocale);
    
    // Set cookie that expires in 1 year
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Refresh page to apply new server-side translations
    router.refresh();
  };

  return (
    <select
      value={currentLocale}
      onChange={handleChange}
      className="bg-transparent border border-gray-300 text-slate-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block px-2 py-1 outline-none cursor-pointer hover:bg-slate-50 transition-colors"
      style={{ marginLeft: '12px' }}
    >
      <option value="en">English</option>
      <option value="hi">हिंदी</option>
      <option value="mr">मराठी</option>
    </select>
  );
}
