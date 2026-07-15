import { SignUp } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Create an account", robots: { index: false, follow: false } }

export default function SignUpPage() {
  return <main className="grid min-h-[70vh] place-items-center px-4 py-16"><SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/pro" /></main>
}
