export function formatUpdateCountdown(now: number) {
  const nextUpdate = new Date(now)
  nextUpdate.setUTCHours(6, 0, 0, 0)
  if (nextUpdate.getTime() <= now) nextUpdate.setUTCDate(nextUpdate.getUTCDate() + 1)

  const minutes = Math.ceil((nextUpdate.getTime() - now) / 60_000)
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}H ${String(minutes % 60).padStart(2, "0")}M`
}
