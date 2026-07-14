import Link from "next/link"
import { Plane } from "lucide-react"

export default function InfoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/15">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid size-9 place-items-center bg-primary text-primary-foreground">
              <Plane className="size-4 -rotate-12" aria-hidden="true" />
            </span>
            <span className="text-xl font-black uppercase tracking-[-0.04em]">
              Av<span className="text-primary">TLDR</span>
            </span>
          </Link>
          <Link href="/" className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Back to the briefing
          </Link>
        </div>
      </header>
      {children}
    </div>
  )
}
