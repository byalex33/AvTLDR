import { SignIn } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Log in", robots: { index: false, follow: false } }

export default function SignInPage() {
  return <main className="grid min-h-[70vh] place-items-center px-4 py-16"><SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/account" /></main>
}
