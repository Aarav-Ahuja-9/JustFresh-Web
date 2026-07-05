import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateInvoice(order: any) {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set font
  doc.setFont('helvetica');

  // Add Company Logo / Name (Header)
  doc.setFontSize(24);
  doc.setTextColor(5, 150, 105); // Emerald 600
  doc.text('JustFresh Agro', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('Mandi to Store', 14, 26);
  doc.text('Mumbai, Maharashtra', 14, 31);
  doc.text('Email: support@justfreshagro.com', 14, 36);

  // Invoice Title & Details
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text('TAX INVOICE', 140, 20);
  
  doc.setFontSize(10);
  doc.text(`Invoice No: INV-${order.id.slice(-6).toUpperCase()}`, 140, 28);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 34);
  doc.text(`Status: ${order.status}`, 140, 40);

  // Divider
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.line(14, 45, 196, 45);

  // Customer Information (Bill To)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To:', 14, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`${order.firstName} ${order.lastName}`, 14, 62);
  doc.text(`${order.address}`, 14, 67);
  doc.text(`${order.city}, ${order.postalCode || ''}`, 14, 72);
  doc.text(`Email: ${order.email}`, 14, 77);
  if (order.phone) {
    doc.text(`Phone: ${order.phone}`, 14, 82);
  }

  // Delivery Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Delivery Details:', 120, 55);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Payment Method: ${order.paymentMethod.replace('_', ' ')}`, 120, 62);
  doc.text(`Delivery Slot: ${order.deliverySlot}`, 120, 67);

  // Table Data Preparation
  const tableData = order.items.map((item: any, index: number) => {
    const productName = item.product?.name || 'Unknown Product';
    const quantity = item.quantity;
    const price = `Rs. ${item.price.toFixed(2)}`;
    const total = `Rs. ${(item.price * item.quantity).toFixed(2)}`;
    return [index + 1, productName, price, quantity, total];
  });

  // Render Table using jspdf-autotable
  autoTable(doc, {
    startY: 95,
    head: [['#', 'Item Description', 'Unit Price', 'Qty', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [5, 150, 105], // Emerald 600
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      font: 'helvetica',
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 10 },
      2: { halign: 'right' },
      3: { halign: 'center' },
      4: { halign: 'right' },
    },
  });

  // Calculate Subtotals
  const finalY = (doc as any).lastAutoTable.finalY || 95;
  
  // Totals Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.rect(130, finalY + 10, 66, 30, 'FD');
  
  doc.setFontSize(10);
  doc.text('Subtotal:', 135, finalY + 18);
  doc.text(`Rs. ${order.totalAmount.toFixed(2)}`, 190, finalY + 18, { align: 'right' });
  
  doc.text('Delivery:', 135, finalY + 25);
  doc.text('Free', 190, finalY + 25, { align: 'right' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 135, finalY + 35);
  doc.setTextColor(5, 150, 105);
  doc.text(`Rs. ${order.totalAmount.toFixed(2)}`, 190, finalY + 35, { align: 'right' });

  // Footer Note
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.text('Thank you for choosing JustFresh Agro!', 105, 280, { align: 'center' });
  doc.text('For any queries, please contact support@justfreshagro.com', 105, 285, { align: 'center' });

  // Save the PDF
  doc.save(`Invoice_INV-${order.id.slice(-6).toUpperCase()}.pdf`);
}
