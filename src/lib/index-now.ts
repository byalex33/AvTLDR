import { SITE_URL } from "./seo.ts"

export const INDEX_NOW_KEY = "ea5a36bbb95e9cc6553af97730a6f8a6"
const INDEX_NOW_ENDPOINT = "https://api.indexnow.org/indexnow"

export function indexNowPayload(urls: readonly string[]) {
  const site = new URL(SITE_URL)
  const urlList = [...new Set(urls)].filter((value) => {
    try {
      return new URL(value).origin === site.origin
    } catch {
      return false
    }
  }).slice(0, 10_000)

  return {
    host: site.host,
    key: INDEX_NOW_KEY,
    keyLocation: `${SITE_URL}/${INDEX_NOW_KEY}.txt`,
    urlList,
  }
}

export async function notifyIndexNow(urls: readonly string[]) {
  const payload = indexNowPayload(urls)
  if (!payload.urlList.length) return

  const response = await fetch(INDEX_NOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  })
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow rejected the URL update with status ${response.status}`)
  }
}
