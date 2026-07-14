export type StoryCategory =
  | "Airlines"
  | "Aircraft"
  | "Safety"
  | "Military"
  | "Technology"

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
  url: string
  imageUrl?: string
}

export const previewGeneratedAt = "2026-07-14T06:00:00.000Z"

export function storyPath(date: string, id: string) {
  return `/stories/${date}/${encodeURIComponent(id)}`
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
    publishedAt: "Yesterday",
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
    publishedAt: "1h ago",
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
    publishedAt: "Yesterday",
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
    publishedAt: "Yesterday",
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
    publishedAt: "Today",
    url: "https://avweb.com/ownership/fuel-news/gulfstream-tests-100-saf-at-50000-feet/",
    imageUrl: "https://avweb.com/wp-content/uploads/2026/07/Screenshot-2026-07-10-at-10.12.25-AM.png",
  },
  {
    id: "ryanair-window-detached",
    importance: 9,
    category: "Safety",
    headline: "Ryanair 737 returns after passenger window detaches",
    summary:
      "A Ryanair flight returned to Thessaloniki after a passenger window detached while the aircraft was en route to Germany.",
    whatHappened:
      "Passengers said a seatbelt and nearby travellers kept the affected passenger inside before the aircraft landed normally.",
    whyItMatters:
      "A window failure and possible decompression demand close investigation even when the aircraft lands without further incident.",
    source: "AirlineGeeks",
    publishedAt: "4 days ago",
    url: "https://airlinegeeks.com/2026/07/10/ryanair-737-makes-emergency-landing-after-window-detached-in-flight/",
    imageUrl: "https://airlinegeeks.com/wp-content/uploads/2019/07/Ryanair-B738-BCN-William-Derrickson.jpg?w=1024",
  },
  {
    id: "delta-basic-premium-fares",
    importance: 6,
    category: "Airlines",
    headline: "Delta adds Basic fares to its premium cabins",
    summary:
      "Delta has introduced lower-priced Basic options for First, Premium Select and Delta One products.",
    whatHappened:
      "The fares retain the onboard product but restrict seat selection, baggage, mileage earning, upgrades and lounge access.",
    whyItMatters:
      "Unbundling premium cabins could reshape how major airlines price and sell their highest-value seats.",
    source: "AirlineGeeks",
    publishedAt: "6 days ago",
    url: "https://airlinegeeks.com/2026/07/08/delta-extends-basic-fare-option-to-premium-offerings/",
    imageUrl: "https://airlinegeeks.com/wp-content/uploads/2026/02/dal_a321_neo-462-scaled.jpg?w=1024",
  },
  {
    id: "aura-aero-integral-airventure",
    importance: 4,
    category: "Aircraft",
    headline: "AURA AERO brings its certified trainer to AirVenture",
    summary:
      "AURA AERO will fly its two-seat INTEGRAL R aerobatic trainer at EAA AirVenture while pursuing US certification.",
    whatHappened:
      "The French manufacturer plans demonstration flights and presentations around the European-certified aircraft.",
    whyItMatters:
      "A successful FAA campaign would bring another modern training aircraft into the large US flight-school market.",
    source: "AVweb",
    publishedAt: "5 days ago",
    url: "https://avweb.com/aviation-news/aura-aero-integral-r-airventure/",
    imageUrl: "https://avweb.com/wp-content/uploads/2026/07/INTEGRAL-R-MSN003-flying-%C2%A9-James-Darcy.jpg",
  },
  {
    id: "air-zimbabwe-gatwick-return",
    importance: 6,
    category: "Airlines",
    headline: "Air Zimbabwe prepares to restore London Gatwick route",
    summary:
      "Direct flights between Harare and London Gatwick are set to return after a 14-year break.",
    whatHappened:
      "Plus Ultra will operate three weekly Airbus A330 services under a long-term ACMI agreement from late July.",
    whyItMatters:
      "The route restores direct passenger and freight connectivity between the UK and Zimbabwe.",
    source: "UK Aviation News",
    publishedAt: "2 days ago",
    url: "https://ukaviation.aero/zimbabwe-to-london-gatwick-route-set-to-return-this-month/",
  },
  {
    id: "flightradar24-navigraph-simulator",
    importance: 4,
    category: "Technology",
    headline: "Flightradar24 brings live traffic data to flight simulators",
    summary:
      "A Navigraph partnership is bringing real-world Flightradar24 traffic into the flight simulation ecosystem.",
    whatHappened:
      "The first integration uses FSLTL to inject live, model-matched traffic into Microsoft Flight Simulator.",
    whyItMatters:
      "Access to live traffic makes consumer simulators more realistic and expands the commercial reach of flight-tracking data.",
    source: "Flightradar24",
    publishedAt: "May 27",
    url: "https://www.flightradar24.com/blog/inside-flightradar24/flightradar24-coming-to-a-flight-simulator-near-you/",
  },
  {
    id: "boeing-787-weight-certification",
    importance: 7,
    category: "Aircraft",
    headline: "FAA approves higher take-off weights for Boeing 787 variants",
    summary:
      "Boeing's 787-9 and 787-10 can now offer operators additional payload or range through an optional weight increase.",
    whatHappened:
      "The 787-9 gains up to three tonnes of payload or 300nm of range, while the 787-10 gains five tonnes or 400nm.",
    whyItMatters:
      "The upgrade gives airlines more flexibility on long-haul routes without waiting for a new aircraft variant.",
    source: "FlightGlobal",
    publishedAt: "March 23",
    url: "https://www.flightglobal.com/airframers/boeing-secures-faa-certification-for-increased-maximum-take-off-weights-on-787-9-and-10/166750.article",
  },
]
