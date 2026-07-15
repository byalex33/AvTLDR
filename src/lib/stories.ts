export type StoryCategory =
  | "Airlines"
  | "Aircraft"
  | "Safety"
  | "Military"
  | "Technology"

export type StoryRecencyLabel = "Developing" | "Worth Knowing"
export type PublicationDateSource = "structured" | "open-graph" | "metadata" | "time" | "url"

export type Story = {
  id: string
  importance: number
  category: StoryCategory
  headline: string
  summary: string
  whatHappened: string
  whyItMatters: string
  source: string
  publishedAt: string
  publicationDateSource?: PublicationDateSource
  recencyLabel?: StoryRecencyLabel
  updateOf?: string
  updateSummary?: string
  url: string
  imageUrl?: string
}

export const previewGeneratedAt = "2026-07-14T06:00:00.000Z"

export function storyPath(date: string, id: string) {
  return `/stories/${date}/${encodeURIComponent(id)}`
}

export function formatStoryPublishedAt(publishedAt: string) {
  const date = new Date(publishedAt)
  if (Number.isNaN(date.getTime())) return publishedAt

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
    timeZoneName: "short",
  }).format(date)
}

export function browseStories(
  stories: Story[],
  filters: { publisher: string; category: string; query: string; sort: string }
) {
  const search = filters.query.trim().toLowerCase()
  return stories
    .filter(
      (story) =>
        (filters.publisher === "All" || story.source === filters.publisher) &&
        (filters.category === "All" || story.category === filters.category) &&
        (!search || `${story.headline} ${story.summary}`.toLowerCase().includes(search))
    )
    .toSorted((a, b) => {
      if (filters.sort === "publisher") return a.source.localeCompare(b.source) || b.importance - a.importance
      if (filters.sort === "category") return a.category.localeCompare(b.category) || b.importance - a.importance
      return b.importance - a.importance
    })
}

export const stories: Story[] = [
  {
    id: "yemen-sanaa-runway-strike",
    importance: 9,
    category: "Military",
    headline: "Yemen strikes Sana'a airport runway to block Iranian flight",
    summary:
      "Yemen's Saudi-backed government struck the capital's airport runway to prevent a Mahan Air flight from landing.",
    whatHappened:
      "The Tehran flight diverted to Hodeidah, while Yemen temporarily closed all airports before reopening them several hours later.",
    whyItMatters:
      "The strike threatens to end years of relative de-escalation and puts civilian aviation back inside a widening regional dispute.",
    source: "AeroTime",
    publishedAt: "2026-07-13T06:00:00.000Z",
    url: "https://www.aerotime.aero/articles/yemen-strikes-sanaa-airport-runway-mahan-air-flight-iran",
    imageUrl: "https://www.aerotime.aero/images/2024/10/Mahan-Air-Airbus-A340-600.jpg",
  },
  {
    id: "norwegian-results",
    importance: 6,
    category: "Airlines",
    headline: "Norwegian reports $61.9M quarterly loss",
    summary:
      "Higher fuel costs and a Norwegian Supreme Court ruling pushed the airline into a second-quarter loss.",
    whatHappened:
      "Fuel costs rose by 33%, while emissions obligations and currency effects added further pressure.",
    whyItMatters:
      "The result shows how quickly fuel and regulatory costs can erase otherwise improving airline demand.",
    source: "AeroTime",
    publishedAt: "2026-07-14T05:00:00.000Z",
    url: "https://www.aerotime.aero/articles/norwegian-quater-two-result-2026-loss",
    imageUrl: "https://www.aerotime.aero/images/2025/09/Norwegian-Boeing-737-MAX-8.jpg",
  },
  {
    id: "riyadh-air-787",
    importance: 7,
    category: "Aircraft",
    headline: "Riyadh Air weighs another 25–30 Boeing 787s",
    summary:
      "Saudi Arabia's new flag carrier is considering a sizeable follow-on Dreamliner order.",
    whatHappened:
      "The potential deal would expand Riyadh Air's long-haul fleet as it builds out its international network.",
    whyItMatters:
      "A firm order would strengthen Boeing's widebody backlog and signal continued Gulf aviation growth.",
    source: "AeroTime",
    publishedAt: "2026-07-13T12:00:00.000Z",
    url: "https://www.aerotime.aero/articles/riyadh-air-weighs-firm-order-for-25-30-more-boeing-787s",
    imageUrl: "https://www.aerotime.aero/images/2025/12/Riyadh-Air-Boeing-787-Dreamliner-US.jpg",
  },
  {
    id: "lapd-drone-strike",
    importance: 8,
    category: "Safety",
    headline: "Large drone collides with LAPD helicopter",
    summary:
      "A police helicopter returned safely after a drone strike during a patrol over Los Angeles.",
    whatHappened:
      "The collision damaged the helicopter but the crew landed without reported injuries.",
    whyItMatters:
      "The incident adds urgency to enforcement and detection around unauthorized drone operations.",
    source: "AeroTime",
    publishedAt: "2026-07-13T12:00:00.000Z",
    url: "https://www.aerotime.aero/articles/lapd-helicopter-drone-los-angeles",
    imageUrl: "https://www.aerotime.aero/images/2026/07/18696fb1-6958-45e9-a22d-0256b506876d.jpg",
  },
  {
    id: "gulfstream-saf",
    importance: 7,
    category: "Technology",
    headline: "Gulfstream tests 100% SAF at 50,000 feet",
    summary:
      "A Gulfstream test flight examined how pure sustainable aviation fuel behaves at high altitude.",
    whatHappened:
      "Early results point to lower particle emissions associated with contrail formation.",
    whyItMatters:
      "The research could clarify whether cleaner fuels reduce aviation's non-CO₂ climate effects.",
    source: "AVweb",
    publishedAt: "2026-07-14T02:00:00.000Z",
    url: "https://avweb.com/ownership/fuel-news/gulfstream-tests-100-saf-at-50000-feet/",
    imageUrl: "https://avweb.com/wp-content/uploads/2026/07/Screenshot-2026-07-10-at-10.12.25-AM.png",
  },
  {
    id: "flamingo-air-aoc-suspended",
    importance: 9,
    category: "Safety",
    headline: "Flamingo Air certificate suspended after fatal crash",
    summary:
      "Bahamian regulators suspended Flamingo Air's operating certificate while investigators examine a fatal Cessna 402 crash.",
    whatHappened:
      "All 10 people aboard the July 10 flight were killed, and the regulator cited that crash plus a separate engine problem involving the airline that day.",
    whyItMatters:
      "Grounding the carrier is a significant precaution while investigators assess two safety events involving one operator on the same day.",
    source: "Aviation Week",
    publishedAt: "2026-07-13T22:09:24.000Z",
    publicationDateSource: "structured",
    url: "https://aviationweek.com/air-transport/safety-ops-regulation/flamingo-air-aoc-temporarily-suspended-following-fatal-crash",
  },
  {
    id: "korean-air-quarterly-loss",
    importance: 7,
    category: "Airlines",
    headline: "Fuel surge pushes Korean Air to quarterly loss",
    summary:
      "Korean Air reported a $65.1 million second-quarter loss as fuel costs and Middle East disruption hit profitability.",
    whatHappened:
      "Fuel spending more than doubled year on year and operating expenses rose 32.6%, although the airline remained profitable across the first half.",
    whyItMatters:
      "The reversal shows how renewed fuel and geopolitical pressure is flowing directly into major airline results and fares.",
    source: "Aviation Week",
    publishedAt: "2026-07-13T13:32:42.000Z",
    publicationDateSource: "structured",
    url: "https://aviationweek.com/air-transport/airlines-lessors/soaring-fuel-prices-hurt-korean-airs-profitability",
  },
  {
    id: "rtx-high-density-electric-motor",
    importance: 6,
    category: "Technology",
    headline: "RTX runs high-density electric aviation motor",
    summary:
      "RTX has operated a 250-kW aviation motor designed to deliver unusually high power without the usual weight penalty.",
    whatHappened:
      "The ARPA-E-backed demonstrator achieved a reported power density of 14.4 kW per kilogram as part of the Ultra-Compact project.",
    whyItMatters:
      "Lighter electric propulsion is a key enabling technology for practical hybrid and electric aircraft with useful payload and range.",
    source: "Aviation Week",
    publishedAt: "2026-07-13T21:13:12.000Z",
    publicationDateSource: "structured",
    url: "https://aviationweek.com/aerospace/emerging-technologies/rtx-runs-high-power-density-electric-motor-aviation",
  },
  {
    id: "riyadh-air-china-approval",
    importance: 6,
    category: "Airlines",
    headline: "Riyadh Air cleared to launch Beijing and Shanghai flights",
    summary:
      "China's aviation regulator approved Riyadh Air passenger and cargo services to Beijing and Shanghai.",
    whatHappened:
      "The approvals allow three weekly Riyadh-Beijing flights and four weekly Riyadh-Shanghai flights, although launch dates remain unannounced.",
    whyItMatters:
      "Direct China access advances the startup's international expansion and adds new competition to a market currently led by Saudia.",
    source: "Aviation Week",
    publishedAt: "2026-07-13T14:30:54.000Z",
    publicationDateSource: "structured",
    url: "https://aviationweek.com/air-transport/airports-networks/riyadh-air-cleared-regulator-china-debut",
  },
  {
    id: "air-canada-iamaw-deal",
    importance: 5,
    category: "Airlines",
    headline: "Air Canada and IAMAW reach tentative four-year deal",
    summary:
      "Air Canada reached a tentative collective agreement covering about 11,000 technical and operational employees.",
    whatHappened:
      "The four-year deal covers maintenance, airports, cargo, logistics and supply employees and remains subject to union ratification.",
    whyItMatters:
      "Ratification would remove a major labour risk across maintenance and ground operations at Canada's largest airline.",
    source: "AeroTime",
    publishedAt: "2026-07-13T14:17:22.000Z",
    publicationDateSource: "structured",
    url: "https://www.aerotime.aero/articles/air-canada-iamaw-reach-tentative-deal-covering-11000-maintenance-workers",
  },
  {
    id: "qantas-western-sydney-freighter",
    importance: 5,
    category: "Aircraft",
    headline: "Qantas A321 freighter completes Western Sydney trial",
    summary:
      "A Qantas A321 became the first freighter to land at Western Sydney International ahead of regular cargo operations.",
    whatHappened:
      "The readiness flight tested aircraft handling, ground systems and cargo transfers before domestic freighter services begin on July 27.",
    whyItMatters:
      "The trial is a practical milestone for Australia's newest major airport and its planned 24-hour freight operation.",
    source: "AeroTime",
    publishedAt: "2026-07-13T11:30:39.000Z",
    publicationDateSource: "structured",
    url: "https://www.aerotime.aero/articles/qantas-a321-becomes-first-freighter-to-land-at-western-sydney-international",
  },
  {
    id: "gatwick-chengdu-service",
    importance: 6,
    category: "Airlines",
    headline: "Air China launches Gatwick–Chengdu service",
    summary:
      "Air China has launched a new three-times-weekly service between London Gatwick and Chengdu Tianfu.",
    whatHappened:
      "The route began on July 12 and is Air China's third destination from Gatwick, following Beijing and Shanghai.",
    whyItMatters:
      "The expansion reflects growing UK–China demand and strengthens Gatwick's connectivity to Asian markets.",
    source: "Gatwick Airport",
    publishedAt: "2026-07-14T00:00:00.000Z",
    publicationDateSource: "structured",
    url: "https://www.mediacentre.gatwickairport.com/news/london-gatwick-builds-on-china-network-momentum-with-new-air-china-service-to-chengdu-5d841-40f32.html",
  },
]
