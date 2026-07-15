import { UserButton } from "@clerk/nextjs"
import { Bookmark, CreditCard, Plane, Search } from "lucide-react"
import Link from "next/link"

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return <div className="min-h-screen bg-background">
    <header className="border-b border-foreground/15 bg-card">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="mr-auto flex min-h-11 items-center gap-3">
          <span className="grid size-10 place-items-center bg-primary text-primary-foreground"><Plane className="size-5 -rotate-12" aria-hidden="true" /></span>
          <span className="text-xl font-black uppercase">Av<span className="text-primary">TLDR</span> <span className="text-xs tracking-widest">Pro</span></span>
        </Link>
        <nav aria-label="Pro account" className="order-3 flex w-full gap-5 overflow-x-auto text-sm font-bold sm:order-2 sm:w-auto">
          <Link href="/account" className="whitespace-nowrap hover:text-primary">Dashboard</Link>
          <Link href="/account/search" className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-primary"><Search className="size-4" />Search</Link>
          <Link href="/account/bookmarks" className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-primary"><Bookmark className="size-4" />Bookmarks</Link>
          <Link href="/account/billing" className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-primary"><CreditCard className="size-4" />Billing</Link>
        </nav>
        <div className="order-2 sm:order-3"><UserButton /></div>
      </div>
    </header>
    {children}
  </div>
}
