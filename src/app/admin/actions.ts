"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sendOrderStatusEmail } from "@/lib/email";

export async function adminLogin(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === "admin" && password === adminPassword && adminPassword) {
    // Set cookie
    (await cookies()).set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    
    redirect("/admin/dashboard");
  } else {
    return { error: "Invalid credentials" };
  }
}

export async function adminLogout() {
  (await cookies()).delete("admin_session");
  redirect("/admin/login");
}

export async function addProduct(formData: FormData) {
  // Protect action
  if (!(await cookies()).get("admin_session")) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const unit = formData.get("unit") as string;
  const imageUrl = formData.get("imageUrl") as string || null;
  const isFeatured = formData.get("isFeatured") === "on";
  const minStockLevelRaw = formData.get("minStockLevel") as string;
  const minStockLevel = minStockLevelRaw ? parseInt(minStockLevelRaw, 10) : 10;
  const stockRaw = formData.get("stock") as string;
  const stock = stockRaw ? parseInt(stockRaw, 10) : 0;

  if (!name || isNaN(price) || !unit) {
    throw new Error("Missing required fields");
  }

  await db.product.create({
    data: {
      name,
      price,
      unit,
      imageUrl,
      isFeatured,
      minStockLevel,
      stock,
    },
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/portal/shop");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  // Protect action
  if (!(await cookies()).get("admin_session")) {
    throw new Error("Unauthorized");
  }

  await db.product.delete({
    where: { id },
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/portal/shop");
  revalidatePath("/");
}

export async function updateProductInventory(productId: string, formData: FormData) {
  if (!(await cookies()).get("admin_session")) {
    throw new Error("Unauthorized");
  }

  const stockRaw = formData.get("stock") as string;
  const minStockRaw = formData.get("minStockLevel") as string;

  const stock = stockRaw ? parseInt(stockRaw, 10) : 0;
  const minStockLevel = minStockRaw ? parseInt(minStockRaw, 10) : 10;

  await db.product.update({
    where: { id: productId },
    data: {
      stock,
      minStockLevel
    }
  });

  revalidatePath("/admin/dashboard");
  revalidatePath("/portal/shop");
  revalidatePath("/");
}

export async function updateOrderStatus(orderId: string, status: string) {
  // Protect action
  if (!(await cookies()).get("admin_session")) {
    throw new Error("Unauthorized");
  }

  const order = await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  // Send status update email in the background
  sendOrderStatusEmail({
    orderId: order.id,
    email: order.email,
    firstName: order.firstName,
    status: order.status
  });

  revalidatePath("/admin/dashboard");
}

export async function deleteOrderPermanently(orderId: string) {
  if (!(await cookies()).get("admin_session")) throw new Error("Unauthorized");
  await db.order.delete({ where: { id: orderId } });
  revalidatePath("/admin/dashboard");
}

export async function deleteAllProducts() {
  if (!(await cookies()).get("admin_session")) throw new Error("Unauthorized");
  // Delete all order items first to avoid foreign key constraints? Wait, order items don't have cascade on product!
  // We must delete order items first, OR Prisma will throw error.
  await db.orderItem.deleteMany();
  await db.product.deleteMany();
  revalidatePath("/admin/dashboard");
  revalidatePath("/portal/shop");
  revalidatePath("/");
}

export async function deleteAllOrders() {
  if (!(await cookies()).get("admin_session")) throw new Error("Unauthorized");
  await db.order.deleteMany();
  revalidatePath("/admin/dashboard");
}

export async function addCoupon(formData: FormData) {
  const code = formData.get("code") as string;
  const discountType = formData.get("discountType") as string;
  const discountValue = parseFloat(formData.get("discountValue") as string);
  const minOrderAmount = parseFloat(formData.get("minOrderAmount") as string) || 0;
  
  if (!code || !discountType || isNaN(discountValue)) return;

  await db.coupon.create({
    data: {
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount,
    }
  });
  
  revalidatePath("/admin/dashboard");
}

export async function deleteCoupon(id: string) {
  await db.coupon.delete({ where: { id } });
  revalidatePath("/admin/dashboard");
}

export async function toggleCoupon(id: string, isActive: boolean) {
  await db.coupon.update({
    where: { id },
    data: { isActive: !isActive }
  });
  revalidatePath("/admin/dashboard");
}

export async function deleteAllUsers() {
  if (!(await cookies()).get("admin_session")) throw new Error("Unauthorized");
  // Deleting users will cascade delete orders? Wait, Order -> User is NOT cascade!
  // In Prisma, `userId` is nullable on Order. So if we delete a user, we should also delete their sessions/accounts.
  // BetterAuth's Prisma adapter has cascade on Session/Account.
  await db.user.deleteMany();
}
