export type StoryCategory =
  | "Airlines"
  | "Aircraft"
  | "Safety"
  | "Military"
  | "Technology"

export type Story = {
  id: string
  category: StoryCategory
  headline: string
  summary: string
  whatHappened: string
  whyItMatters: string
  source: string
  publishedAt: string
  url: string
}

export const stories: Story[] = [
  {
    id: "cebu-pacific-starlink",
    category: "Technology",
    headline: "Cebu Pacific plans Starlink Wi-Fi rollout from 2027",
    summary:
      "The airline is set to become Southeast Asia's first low-cost carrier to offer Starlink connectivity.",
    whatHappened:
      "Cebu Pacific joined a wider Indigo Partners commitment covering more than 1,000 aircraft across five airlines.",
    whyItMatters:
      "Fast satellite Wi-Fi is moving from a premium extra toward a standard expectation on low-cost flights.",
    source: "AeroTime",
    publishedAt: "3h ago",
    url: "https://www.aerotime.aero/articles/cebu-pacific-to-become-first-sea-low-cost-carrier-with-starlink-wi-fi",
  },
  {
    id: "norwegian-results",
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
  },
  {
    id: "riyadh-air-787",
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
  },
  {
    id: "lapd-drone-strike",
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
  },
  {
    id: "mv75-cheyenne",
    category: "Military",
    headline: "Collins Aerospace selected for Army MV-75 systems",
    summary:
      "RTX's Collins Aerospace will supply key equipment for the US Army's new MV-75 Cheyenne tiltrotor.",
    whatHappened:
      "The supplier will support the aircraft chosen for the Army's Future Long Range Assault Aircraft program.",
    whyItMatters:
      "The program is central to the Army's plan to replace parts of its Black Hawk helicopter fleet.",
    source: "AeroTime",
    publishedAt: "4h ago",
    url: "https://www.aerotime.aero/articles/rtxs-collins-aerospace-to-equip-us-armys-new-mv-75-cheyenne-rotorcraft",
  },
  {
    id: "gulfstream-saf",
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
  },
]
