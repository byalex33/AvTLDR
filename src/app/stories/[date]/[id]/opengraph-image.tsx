import { ImageResponse } from "next/og"

import { loadEditionByDate } from "@/lib/news"
import { stories } from "@/lib/stories"

export const alt = "AvTLDR aviation story"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const revalidate = 3600

export default async function StoryOpenGraphImage({ params }: { params: Promise<{ date: string; id: string }> }) {
  const { date, id } = await params
  const edition = await loadEditionByDate(date, stories)
  const story = edition?.stories.find((item) => item.id === id)
  const headline = story?.headline ?? "Global aviation news, shortened"

  return new ImageResponse(
    <div style={{ background: "#020617", color: "white", display: "flex", flexDirection: "column", fontFamily: "sans-serif", height: "100%", justifyContent: "space-between", padding: "70px 78px", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ color: "#ef4b2f", fontSize: 30, fontWeight: 900, letterSpacing: -1 }}>AvTLDR.news</div>
        <div style={{ color: "#94a3b8", fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>{story?.category?.toUpperCase() ?? "DAILY BRIEFING"}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1040 }}>
        <div style={{ background: "#ef4b2f", height: 10, marginBottom: 34, width: 140 }} />
        <div style={{ fontSize: headline.length > 100 ? 50 : 62, fontWeight: 800, letterSpacing: -2.5, lineHeight: 1.08 }}>{headline}</div>
        {story && <div style={{ color: "#cbd5e1", fontSize: 28, lineHeight: 1.35, marginTop: 26 }}>{story.summary}</div>}
      </div>
      <div style={{ borderTop: "2px solid #334155", color: "#94a3b8", display: "flex", fontSize: 21, justifyContent: "space-between", paddingTop: 24 }}>
        <span>{story ? `Source: ${story.source}` : "Aviation intelligence, distilled daily"}</span>
        <span style={{ color: "#ef4b2f", fontWeight: 700 }}>READ THE SHORT VERSION</span>
      </div>
    </div>,
    size,
  )
}
