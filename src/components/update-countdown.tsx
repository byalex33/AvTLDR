"use client"

import { useEffect, useState } from "react"

import { formatUpdateCountdown } from "@/lib/update-countdown"

export function UpdateCountdown() {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    const update = () => setNow(Date.now())
    update()
    const timer = setInterval(update, 1_000)
    return () => clearInterval(timer)
  }, [])

  const countdown = now ? formatUpdateCountdown(now) : "--H --M"

  return (
    <p className="shrink-0 whitespace-nowrap text-white/60" aria-label={`Next update in ${countdown}`}>
      <span aria-hidden="true" className="hidden sm:inline">Next update in </span>
      <span className="tabular-nums text-white" aria-hidden="true">{countdown}</span>
    </p>
  )
}
