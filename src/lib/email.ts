import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({
  orderId,
  email,
  firstName,
  totalAmount,
  items
}: {
  orderId: string;
  email: string;
  firstName: string;
  totalAmount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}) {
  try {
    let itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price.toFixed(2)}</td>
      </tr>
    `).join('');

    const res = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: `Order Confirmation - JustFresh Agro (#${orderId.slice(-6).toUpperCase()})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w-lg mx-auto; color: #333;">
          <h2 style="color: #16a34a;">Thank you for your order, ${firstName}!</h2>
          <p>We've received your order and are getting it ready for delivery.</p>
          
          <div style="margin-top: 30px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f9fafb; padding: 15px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">
              Order Summary (#${orderId.slice(-6).toUpperCase()})
            </div>
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
              <thead>
                <tr>
                  <th style="padding: 10px; border-bottom: 1px solid #eee;">Item</th>
                  <th style="padding: 10px; border-bottom: 1px solid #eee;">Qty</th>
                  <th style="padding: 10px; border-bottom: 1px solid #eee;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 15px 10px; font-weight: bold; text-align: right;">Total</td>
                  <td style="padding: 15px 10px; font-weight: bold; color: #16a34a;">₹${totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            You can check the status of your order anytime in your Dashboard.<br>
            Thank you for choosing JustFresh Agro!
          </p>
        </div>
      `
    });
    console.log("Order Confirmation Email Sent:", res);
    return { success: true };
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    return { error };
  }
}

export async function sendOrderStatusEmail({
  orderId,
  email,
  firstName,
  status
}: {
  orderId: string;
  email: string;
  firstName: string;
  status: string;
}) {
  try {
    let message = "";
    if (status === "PROCESSING") {
      message = "Your order is now being processed and prepared for delivery.";
    } else if (status === "SHIPPED") {
      message = "Great news! Your order has been shipped and is on its way to you.";
    } else if (status === "DELIVERED") {
      message = "Your order has been delivered. Enjoy your fresh produce!";
    } else if (status === "CANCELLED") {
      message = "Your order has been cancelled.";
    } else {
      message = `Your order status has been updated to: ${status}`;
    }

    const res = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: `Order Update: ${status} - JustFresh Agro`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w-lg mx-auto; color: #333;">
          <h2 style="color: #16a34a;">Order Status Update</h2>
          <p>Hi ${firstName},</p>
          <p>${message}</p>
          <p><strong>Order ID:</strong> #${orderId.slice(-6).toUpperCase()}</p>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Check your Dashboard for more details.<br>
            Thank you for choosing JustFresh Agro!
          </p>
        </div>
      `
    });
    console.log("Order Status Email Sent:", res);
    return { success: true };
  } catch (error) {
    console.error("Failed to send order status email:", error);
    return { error };
  }
}
