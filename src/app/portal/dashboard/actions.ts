"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const postalCode = formData.get("postalCode") as string;
  const phone = formData.get("phone") as string;

  await db.profile.upsert({
    where: { userId: session.user.id },
    update: {
      address,
      city,
      postalCode,
      phone,
    },
    create: {
      userId: session.user.id,
      address,
      city,
      postalCode,
      phone,
    }
  });

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/checkout");
}

export async function addAddress(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) throw new Error("Unauthorized");

  const label = formData.get("label") as string || "Address";
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const postalCode = formData.get("postalCode") as string;
  const phone = formData.get("phone") as string;
  const latitudeStr = formData.get("latitude") as string;
  const longitudeStr = formData.get("longitude") as string;

  if (!address || !city || !postalCode || !phone) {
    throw new Error("Missing required fields");
  }

  // Check if they have any addresses yet
  const existingCount = await db.address.count({
    where: { userId: session.user.id }
  });

  const isDefault = existingCount === 0;

  await db.address.create({
    data: {
      userId: session.user.id,
      label,
      address,
      city,
      postalCode,
      phone,
      latitude: latitudeStr ? parseFloat(latitudeStr) : null,
      longitude: longitudeStr ? parseFloat(longitudeStr) : null,
      isDefault
    }
  });

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/checkout");
}

export async function deleteAddress(addressId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) throw new Error("Unauthorized");

  // Ensure address belongs to user
  const address = await db.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await db.address.delete({ where: { id: addressId } });

  // If it was default, make another one default
  if (address.isDefault) {
    const firstOther = await db.address.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });
    if (firstOther) {
      await db.address.update({
        where: { id: firstOther.id },
        data: { isDefault: true }
      });
    }
  }

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/checkout");
}

export async function setDefaultAddress(addressId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) throw new Error("Unauthorized");

  // Ensure address belongs to user
  const address = await db.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Transaction to update all defaults
  await db.$transaction([
    db.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false }
    }),
    db.address.update({
      where: { id: addressId },
      data: { isDefault: true }
    })
  ]);

  revalidatePath("/portal/dashboard");
  revalidatePath("/portal/checkout");
}

export async function submitReview(productId: string, rating: number, comment: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  // Check if user already reviewed this product
  const existingReview = await db.review.findFirst({
    where: {
      productId,
      userId: session.user.id
    }
  });

  if (existingReview) {
    return { error: "You have already reviewed this product." };
  }

  await db.review.create({
    data: {
      productId,
      userId: session.user.id,
      rating,
      comment
    }
  });

  revalidatePath("/portal/shop");
  revalidatePath("/portal/dashboard");
  return { success: true };
}
