"use client";

import { generateInvoice } from "@/lib/generateInvoice";

interface DownloadInvoiceButtonProps {
  order: any;
  className?: string;
}

export default function DownloadInvoiceButton({ order, className }: DownloadInvoiceButtonProps) {
  const handleDownload = () => {
    generateInvoice(order);
  };

  return (
    <button
      onClick={handleDownload}
      className={className || "text-emerald-600 hover:text-emerald-700 font-bold text-sm bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors flex items-center gap-2 mt-2 w-full justify-center"}
    >
      📄 Download Invoice
    </button>
  );
}
