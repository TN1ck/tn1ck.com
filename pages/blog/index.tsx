import type { NextPage } from "next"
import Link from "next/link"
import Container from "../../components/container"
import { metadata as updatePlansMetadata } from "./update-plans"
import { metadata as miuMetadata } from "./miu"
import { metadata as numbersGameMetadata } from "./numbers-game"
import { metadata as dropboxMetadata } from "./dropbox-header"
import { metadata as hashCodeMetadata } from "./hashcode"
import { metadata as howToGenerateSudokusMetadata } from "./how-to-generate-sudokus"
import { metadata as footnotesMetadata } from "./footnotes-in-react"
import { metadata as composableUIs } from "./composable-uis"
import { BlogMetadata } from "../../components/blog"
import Head from "next/head"

const BLOG_ENTRIES: BlogMetadata[] = [
  composableUIs,
  footnotesMetadata,
  howToGenerateSudokusMetadata,
  updatePlansMetadata,
  dropboxMetadata,
  numbersGameMetadata,
  miuMetadata,
  hashCodeMetadata,
]

const Home: NextPage = () => {
  return (
    <Container activeId="blog">
      <Head>
        <title>tn1ck.com | blog</title>
        <meta
          name="description"
          content="Blog posts by Tom Nick about programming, design, and other topics."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col relative bg-slate-50 border-2 border-slate-900 p-6 py-8 mt-16">
        <div className="absolute -top-6 left-4 bg-slate-50 p-2 font-black">
          Blog
        </div>
        <ul>
          {BLOG_ENTRIES.map((metadata) => (
            <li key={metadata.title} className="mb-4">
              <Link
                className="font-bold hover:underline"
                href={`/blog/${metadata.slug}`}
              >
                {metadata.title}
              </Link>
              <div className="text-sm">{metadata.date}</div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}

export default Home
