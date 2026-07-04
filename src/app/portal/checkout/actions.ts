"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendOrderConfirmationEmail } from "@/lib/email";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function validateCoupon(code: string, cartTotal: number) {
  const coupon = await db.coupon.findUnique({
    where: { code: code.toUpperCase() }
  });

  if (!coupon) return { error: "Invalid coupon code." };
  if (!coupon.isActive) return { error: "This coupon is no longer active." };
  if (cartTotal < coupon.minOrderAmount) return { error: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}.` };
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { error: "Coupon usage limit reached." };

  return { coupon };
}

export async function placeOrder(formData: FormData, cartItems: any[], appliedCouponCode: string | null = null) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return { error: "You must be logged in to place an order." };
    }

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const postalCode = formData.get("postalCode") as string;
    const phone = formData.get("phone") as string;
    const latitudeStr = formData.get("latitude") as string;
    const longitudeStr = formData.get("longitude") as string;
    const paymentMethod = formData.get("paymentMethod") as string || "COD";
    const deliverySlot = formData.get("deliverySlot") as string || "ANY";

    console.log("Checkout Fields:", {firstName, lastName, email, address, city, postalCode, phone});

    if (!firstName || !lastName || !email || !address || !city || !postalCode || !phone) {
      console.log("Missing fields in formData", {firstName, lastName, email, address, city, postalCode, phone});
      return { error: "Please fill out all required fields." };
    }

    if (!cartItems || cartItems.length === 0) {
      console.log("Cart is empty or undefined", cartItems);
      return { error: "Your cart is empty." };
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    let discountAmount = 0;
    if (appliedCouponCode) {
      const validCoupon = await validateCoupon(appliedCouponCode, totalAmount);
      if (validCoupon.coupon) {
        discountAmount = validCoupon.coupon.discountType === "PERCENTAGE" 
          ? (totalAmount * validCoupon.coupon.discountValue) / 100 
          : validCoupon.coupon.discountValue;
        
        // Increase coupon usage
        await db.coupon.update({
          where: { id: validCoupon.coupon.id },
          data: { usedCount: { increment: 1 } }
        });
      }
    }

    const finalAmount = Math.max(0, totalAmount - discountAmount);
    console.log("Creating order in DB for:", email, "Total:", finalAmount, "Discount:", discountAmount);

    // Create the order and nested order items in a transaction
    const order = await db.order.create({
      data: {
        userId: session.user.id,
        firstName,
        lastName,
        email,
        address,
        city,
        postalCode,
        phone,
        latitude: latitudeStr ? parseFloat(latitudeStr) : null,
        longitude: longitudeStr ? parseFloat(longitudeStr) : null,
        paymentMethod,
        deliverySlot,
        totalAmount: finalAmount,
        couponCode: appliedCouponCode,
        discountAmount,
        status: "PENDING",
        trackingUpdates: [{ status: "PLACED", time: new Date().toISOString(), note: "Order placed successfully." }],
        items: {
          create: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Send the email in the background
    sendOrderConfirmationEmail({
      orderId: order.id,
      email: email,
      firstName: firstName,
      totalAmount: totalAmount,
      items: cartItems
    });

    revalidatePath("/admin/dashboard");
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Failed to place order", error);
    return { error: `Database Error: ${error?.message || "Unknown error"}` };
  }
}
