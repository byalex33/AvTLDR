"use server"

import { clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { requireAdmin } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export async function setPlan(userId: string, plan: "free" | "pro") {
  await requireAdmin()
  if (!userId.startsWith("user_") || !["free", "pro"].includes(plan)) throw new Error("Invalid subscription")
  const users = (await clerkClient()).users
  const user = await users.getUser(userId)
  const subscriptionId = user.privateMetadata.stripeSubscriptionId
  if (plan === "free" && typeof subscriptionId === "string") {
    await stripe().subscriptions.update(subscriptionId, { cancel_at_period_end: true })
    await users.updateUserMetadata(userId, { publicMetadata: { cancelAtPeriodEnd: true } })
  } else {
    await users.updateUserMetadata(userId, { publicMetadata: { plan, subscriptionStatus: plan === "pro" ? "complimentary" : "free", cancelAtPeriodEnd: false } })
  }
  revalidatePath("/admin")
}

export async function setBanned(userId: string, banned: boolean) {
  const adminId = await requireAdmin()
  if (!userId.startsWith("user_") || userId === adminId) throw new Error("Invalid user")
  const users = (await clerkClient()).users
  await (banned ? users.banUser(userId) : users.unbanUser(userId))
  revalidatePath("/admin")
}
