"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Plane, X } from "lucide-react"

const confettiColors = ["bg-primary", "bg-sky-400", "bg-amber-300", "bg-emerald-400", "bg-white"]

export function NewsletterCelebration() {
  const [visible, setVisible] = useState(true)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    window.history.replaceState(null, "", window.location.pathname)
  }, [])

  useEffect(() => {
    if (!visible) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setVisible(false)
    }

    window.addEventListener("keydown", dismissOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", dismissOnEscape)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-slate-950/75 p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setVisible(false)
      }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
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

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-celebration-title"
        aria-describedby="newsletter-celebration-description"
        className="celebration-card relative w-full max-w-lg border border-primary/60 bg-slate-950 px-6 py-10 text-center text-white shadow-2xl sm:px-10 sm:py-12"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => setVisible(false)}
          className="absolute right-2 top-2 grid size-11 place-items-center text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Close signup confirmation"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <span className="mx-auto grid size-16 place-items-center bg-primary text-primary-foreground">
          <Plane className="size-8 -rotate-12" aria-hidden="true" />
        </span>
        <p className="mt-6 flex items-center justify-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary">
          <Check className="size-4" aria-hidden="true" /> Welcome aboard
        </p>
        <h2 id="newsletter-celebration-title" className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl">
          You&apos;re cleared for take-off.
        </h2>
        <p id="newsletter-celebration-description" className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/65 sm:text-base">
          Signed up! Your inbox just got 30,000 feet more interesting.
        </p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="mt-8 inline-flex h-11 items-center justify-center bg-primary px-6 text-sm font-bold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
