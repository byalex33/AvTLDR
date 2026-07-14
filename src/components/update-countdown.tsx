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

  return (
    <p className="hidden text-white/60 sm:block">
      Next update in <span className="tabular-nums text-white">{now ? formatUpdateCountdown(now) : "--H --M"}</span>
    </p>
  )
}
