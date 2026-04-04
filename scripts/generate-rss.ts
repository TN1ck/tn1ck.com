import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { BLOG_ENTRIES } from "../lib/blog-entries"

const SITE_URL = "https://tn1ck.com"
const RSS_PATH = path.join(process.cwd(), "public", "rss.xml")

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")

const formatRssDate = (date: string) =>
  new Date(`${date}T00:00:00.000Z`).toUTCString()

const description =
  "Blog posts by Tom Nick about programming, design, and other topics."

const items = BLOG_ENTRIES.map((entry) => {
  const postUrl = new URL(`/blog/${entry.slug}`, SITE_URL).toString()
  const postDescription = entry.description || entry.title

  return `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${formatRssDate(entry.date)}</pubDate>
      <description>${escapeXml(postDescription)}</description>
    </item>`
}).join("\n")

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>tn1ck.com</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${formatRssDate(BLOG_ENTRIES[0]?.date ?? "1970-01-01")}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

const main = async () => {
  await mkdir(path.dirname(RSS_PATH), { recursive: true })
  await writeFile(RSS_PATH, rss, "utf8")

  console.log(`Generated RSS feed at ${RSS_PATH}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
