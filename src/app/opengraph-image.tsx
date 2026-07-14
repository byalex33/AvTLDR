import { ImageResponse } from "next/og"

export const alt = "AvTLDR.news — Global aviation news, shortened"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#020617",
        color: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: "sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px 80px",
        width: "100%",
      }}
    >
      <div style={{ background: "#ef4b2f", height: 12, width: 180 }} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            color: "#ef4b2f",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 6,
            marginBottom: 24,
          }}
        >
          AVIATION INTELLIGENCE, DISTILLED DAILY
        </div>
        <div style={{ display: "flex", fontSize: 112, fontWeight: 900, letterSpacing: -7 }}>
          <span>Av</span><span style={{ color: "#ef4b2f" }}>TLDR</span><span>.news</span>
        </div>
        <div style={{ color: "#cbd5e1", fontSize: 38, marginTop: 22 }}>
          Global aviation news, shortened.
        </div>
      </div>
      <div
        style={{
          borderTop: "2px solid #334155",
          color: "#94a3b8",
          display: "flex",
          fontSize: 23,
          justifyContent: "space-between",
          paddingTop: 28,
        }}
      >
        <span>The stories that matter. None of the baggage.</span>
        <span style={{ color: "#ef4b2f", fontWeight: 700 }}>AVTLDR.NEWS</span>
      </div>
    </div>,
    size,
  )
}
