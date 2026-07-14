import { Plane } from "lucide-react"

export default function Loading() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-6 text-center" role="status" aria-live="polite">
      <div>
        <div className="avtldr-loader mx-auto" aria-hidden="true">
          <svg className="size-full" viewBox="0 0 230 230">
            <path
              className="avtldr-loader-path"
              d="M86.429 40c63.616-20.04 101.511 25.08 107.265 61.93 6.487 41.54-18.593 76.99-50.6 87.643-59.46 19.791-101.262-23.577-107.142-62.616C29.398 83.441 59.945 48.343 86.43 40z"
              strokeDasharray="10 10 10 10 10 10 10 432"
              strokeDashoffset="77"
            />
          </svg>
          <Plane className="avtldr-loader-plane" strokeWidth={2.5} />
        </div>
        <p className="mt-5 font-serif text-2xl font-bold">Preparing your briefing…</p>
        <p className="mt-2 text-sm text-muted-foreground">Cleared for take-off shortly.</p>
      </div>
    </div>
  )
}
