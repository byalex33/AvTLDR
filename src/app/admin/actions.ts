"use server"

import { clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

import { requireAdmin } from "@/lib/auth"
import { isStory, loadEdition, refreshNews, saveEdition } from "@/lib/news"
import { stories, type Story, type StoryCategory } from "@/lib/stories"
import { stripe } from "@/lib/stripe"

export async function setPlan(userId: string, plan: "free" | "pro") {
  await requireAdmin()
  if (!userId.startsWith("user_") || !["free", "pro"].includes(plan)) throw new Error("Invalid subscription")
  const users = (await clerkClient()).users
  const user = await users.getUser(userId)
  const subscriptionId = user.privateMetadata.stripeSubscriptionId
  if (typeof subscriptionId === "string") {
    const cancelling = plan === "free"
    await stripe().subscriptions.update(subscriptionId, { cancel_at_period_end: cancelling })
    await users.updateUserMetadata(userId, { publicMetadata: { cancelAtPeriodEnd: cancelling } })
  } else {
    await users.updateUserMetadata(userId, { publicMetadata: { plan, subscriptionStatus: plan === "pro" ? "complimentary" : "free", cancelAtPeriodEnd: false } })
  }
  revalidatePath("/admin")
}

export async function setBanned(userId: string, banned: boolean) {
  const adminId = await requireAdmin()
  if (!userId.startsWith("user_") || userId === adminId || typeof banned !== "boolean") throw new Error("Invalid user")
  const users = (await clerkClient()).users
  await (banned ? users.banUser(userId) : users.unbanUser(userId))
  revalidatePath("/admin")
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin()
  if (!id || id.length > 180) throw new Error("Invalid post")

  // ponytail: single-editor writes; add version checks if concurrent admins become real.
  const edition = await loadEdition(stories)
  const current = edition.stories.find((story) => story.id === id)
  if (!current) throw new Error("Post not found")

  const publishedAtInput = String(formData.get("publishedAt") ?? "")
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(publishedAtInput)) throw new Error("Invalid publication date")
  const publishedAt = new Date(`${publishedAtInput}:00.000Z`)
  if (Number.isNaN(publishedAt.getTime())) throw new Error("Invalid publication date")
  const url = safeUrl(formData.get("url"))
  const imageValue = String(formData.get("imageUrl") ?? "").trim()
  const imageUrl = imageValue ? safeUrl(imageValue) : undefined
  const importanceValue = formData.get("importance")
  const importance = typeof importanceValue === "string" && /^\d+$/.test(importanceValue) ? Number(importanceValue) : Number.NaN
  const updated: Story = {
    ...current,
    importance,
    category: String(formData.get("category")) as StoryCategory,
    headline: String(formData.get("headline") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    whatHappened: String(formData.get("whatHappened") ?? "").trim(),
    whyItMatters: String(formData.get("whyItMatters") ?? "").trim(),
    source: String(formData.get("source") ?? "").trim(),
    publishedAt: publishedAt.toISOString(),
    url,
    ...(imageUrl ? { imageUrl } : { imageUrl: undefined }),
  }
  if (!isStory(updated)) throw new Error("Invalid post")

  await saveEdition({ ...edition, stories: edition.stories.map((story) => story.id === id ? updated : story) })
  revalidateNews()
}

export async function regeneratePosts() {
  await requireAdmin()
  await refreshNews()
  revalidateNews()
}

function safeUrl(value: FormDataEntryValue | null) {
  const input = String(value ?? "").trim()
  if (input.length > 2_000) throw new Error("Invalid URL")
  const url = new URL(input)
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Invalid URL")
  return url.toString()
}

function revalidateNews() {
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/stories")
  revalidatePath("/archive")
  revalidatePath("/stories/[date]/[id]", "page")
  revalidatePath("/archive/[date]", "page")
  revalidatePath("/sitemap.xml")
  revalidatePath("/news-sitemap.xml")
  revalidatePath("/feed.xml")
}
