"use client"

import { useState } from "react"
import { Check, Share2, X } from "lucide-react"

import { storyPath, type Story } from "@/lib/stories"

export function ShareButton({ story, editionDate }: { story: Story; editionDate: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")

  async function share() {
    const url = new URL(storyPath(editionDate, story.id), window.location.origin).toString()
    if (navigator.share) {
      try {
        await navigator.share({ title: story.headline, text: story.summary, url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setStatus("copied")
    } catch {
      setStatus("failed")
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {status === "copied" ? <Check className="size-3.5" aria-hidden="true" /> : status === "failed" ? <X className="size-3.5" aria-hidden="true" /> : <Share2 className="size-3.5" aria-hidden="true" />}
      {status === "copied" ? "Link copied" : status === "failed" ? "Copy failed" : "Share"}
    </button>
  )
}
