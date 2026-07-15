import "server-only"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export function hasProMetadata(metadata: UserPublicMetadata) {
  return metadata.plan === "pro"
}

export function hasAdminMetadata(metadata: UserPublicMetadata) {
  return metadata.role === "admin"
}

export async function requireUser(returnBackUrl: string) {
  const session = await auth()
  if (!session.userId) return session.redirectToSignIn({ returnBackUrl })

  const user = await (await clerkClient()).users.getUser(session.userId)
  return { session, userId: session.userId, user }
}

export async function requirePro() {
  const { session, userId, user } = await requireUser("/account")
  if (!session.has({ feature: "pro" }) && !hasProMetadata(user.publicMetadata)) redirect("/pro?upgrade=1")
  return { userId, user }
}

export async function requireAdmin() {
  const session = await auth()
  if (!session.userId) return session.redirectToSignIn({ returnBackUrl: "/admin" })

  const user = await (await clerkClient()).users.getUser(session.userId)
  if (!hasAdminMetadata(user.publicMetadata)) redirect("/")
  return session.userId
}
