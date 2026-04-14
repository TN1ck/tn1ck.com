export interface BlogEntry {
  title: string
  description: string
  date: string
  slug: string
}

// Keep entries in reverse chronological order.
export const BLOG_ENTRIES: BlogEntry[] = [
  {
    title: "Why some images look brighter than your screen",
    description:
      "How HDR images can make logos and highlights appear unnaturally bright, and how to create them yourself.",
    date: "2026-04-04",
    slug: "abuse-hdr-images-for-marketing",
  },
  {
    title: "Claude Code made me love meetings again",
    description:
      "AI coding tools reduced my dependence on deep flow and gave me the capacity to enjoy spontaneous meetings again.",
    date: "2026-01-27",
    slug: "claude-code-made-me-love-meetings-again",
  },
  {
    title: "If it isn't visible, it's probably broken",
    description:
      "A framework for thinking about visibility: who can see issues, how hard it is to verify, and how often anything gets checked.",
    date: "2025-12-07",
    slug: "if-it-isnt-visible-its-probably-broken",
  },
  {
    title: "How I stopped worrying and learned to love the easy fix",
    description:
      "On the balance between perfect solutions and pragmatic fixes in software engineering",
    date: "2025-11-06",
    slug: "how-i-stopped-worrying-and-learned-to-love-the-easy-fix",
  },
  {
    title: "Don't extend UIs, compose them",
    description: "",
    date: "2024-09-29",
    slug: "composable-uis",
  },
  {
    title: "Footnotes for your React / Next.js blog",
    description: "",
    date: "2024-07-16",
    slug: "footnotes-in-react",
  },
  {
    title: "Generating sudokus for fun and no profit",
    description: "A guide on how to generate sudokus of any difficulty.",
    date: "2024-06-25",
    slug: "how-to-generate-sudokus",
  },
  {
    title: "Safeguarding changes using the plan-execute pattern",
    description:
      "The plan-execute pattern is a way to preview changes before they are applied. This blog post shows how to use this pattern for database updates.",
    date: "2024-02-26",
    slug: "update-plans",
  },
  {
    title: "Recreating the New Dropbox Header Animation",
    description:
      "Dropbox just revamped their branding - and their website. The new header uses a cool clipping effect, which we’ll recreate.",
    date: "2017-11-20",
    slug: "dropbox-header",
  },
  {
    title: "Finding the optimal solution for the numbers game",
    description:
      "One of the games bored students play is the 'Numbers Game,' also known as 'Take Tens' or in German, 'Zahlenspiel.' I once implemented it and wrote a solver to find the minimum number of steps required to solve the game. Here is the solution.",
    date: "2017-10-31",
    slug: "numbers-game",
  },
  {
    title: "The MIU System",
    description:
      "The first exercise introduced in Gödel, Escher, Bach is the MIU System. This post describes the system and how to solve it.",
    date: "2017-09-07",
    slug: "miu",
  },
  {
    title: "Place 101 at Hashcode 2017",
    description:
      "Hashcode is an international programming competition where teams, with a maximum of 4 people, have to solve a complex problem in under 4 hours. We reached place 101 in the 2017 competition; this is a short summary of our experience.",
    date: "2017-03-16",
    slug: "hashcode",
  },
]

const BLOG_ENTRY_MAP = new Map(BLOG_ENTRIES.map((entry) => [entry.slug, entry]))

export const getBlogMetadata = (slug: string): BlogEntry => {
  const metadata = BLOG_ENTRY_MAP.get(slug)

  if (!metadata) {
    throw new Error(`Missing blog metadata for slug: ${slug}`)
  }

  return metadata
}
