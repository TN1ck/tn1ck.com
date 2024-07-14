import type { NextPage } from "next"
import Link from "next/link"
import Container from "../../components/container"
import { METADATA as updatePlansMetadata } from "./update-plans"
import { METADATA as miuMetadata } from "./miu"
import { METADATA as numbersGameMetadata } from "./numbers-game"
import { METADATA as dropboxMetadata } from "./dropbox-header"
import { METADATA as hashCodeMetadata } from "./hashcode"
import { METADATA as howToGenerateSudokusMetadata } from "./how-to-generate-sudokus"
import { BlogMetadata } from "../../components/blog"

const BLOG_ENTRIES: BlogMetadata[] = [
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
