"use client"

import { useEffect, useState } from "react"
import { Check, Plane, X } from "lucide-react"

const confettiColors = ["bg-primary", "bg-sky-400", "bg-amber-300", "bg-emerald-400", "bg-white"]

export function NewsletterCelebration() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    window.history.replaceState(null, "", window.location.pathname)
    const timer = window.setTimeout(() => setVisible(false), 5_200)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => (
          <span
            key={index}
            className={`confetti-piece ${confettiColors[index % confettiColors.length]}`}
            style={{
              left: `${(index * 37) % 100}%`,
              animationDelay: `${(index % 8) * 70}ms`,
              animationDuration: `${1_800 + (index % 5) * 180}ms`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-x-4 top-20 flex justify-center sm:top-24">
        <div role="status" className="celebration-card pointer-events-auto relative w-full max-w-md border border-primary/60 bg-slate-950 p-6 text-white shadow-2xl sm:p-7">
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute right-2 top-2 grid size-11 place-items-center text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Dismiss signup message"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
          <div className="flex items-start gap-4 pr-8">
            <span className="grid size-12 shrink-0 place-items-center bg-primary text-primary-foreground">
              <Plane className="size-6 -rotate-12" aria-hidden="true" />
            </span>
            <div>
              <p className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary">
                <Check className="size-4" aria-hidden="true" /> Welcome aboard
              </p>
              <p className="mt-2 font-serif text-2xl font-bold leading-tight">You&apos;re cleared for take-off.</p>
              <p className="mt-2 text-sm leading-6 text-white/65">Signed up! Your inbox just got 30,000 feet more interesting.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
