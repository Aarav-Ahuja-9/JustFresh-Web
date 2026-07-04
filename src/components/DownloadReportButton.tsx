"use client";

import React from 'react';

export default function DownloadReportButton({ orders }: { orders: any[] }) {
  const handleDownload = () => {
    // Generate CSV
    const headers = [
      "Order ID", 
      "Date", 
      "Customer Name", 
      "Email", 
      "Phone", 
      "Status", 
      "Payment Method", 
      "Items Details", 
      "Total Amount"
    ];
    
    const rows = orders.map(order => {
      // Escape strings containing commas or quotes
      const escapeCSV = (str: string) => `"${String(str).replace(/"/g, '""')}"`;
      
      const itemsDetail = order.items.map((i: any) => `${i.product.name} (x${i.quantity})`).join("; ");
      
      return [
        order.id,
        new Date(order.createdAt).toLocaleString(),
        escapeCSV(`${order.firstName} ${order.lastName}`),
        escapeCSV(order.email),
        escapeCSV(order.phone || 'N/A'),
        order.status,
        order.paymentMethod,
        escapeCSV(itemsDetail),
        order.totalAmount.toFixed(2)
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `JustFresh_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleDownload}
      className="bg-green-600 text-white font-bold py-2 px-4 rounded-xl hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
    >
      <span>📊</span> Download Report (CSV)
    </button>
  );
}
