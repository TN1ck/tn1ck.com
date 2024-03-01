import type { NextPage } from "next"
import Link from "next/link"
import Container from "../../components/container"
import { METADATA as updatePlansMetadata } from "./update-plans"
import { METADATA as miuMetadata } from "./miu"
import { METADATA as numbersGameMetadata } from "./numbers-game"
import { METADATA as dropboxMetadata } from "./dropbox-header"
import { METADATA as hashCodeMetadata } from "./hashcode"

const BLOG_ENTRIES = [
  updatePlansMetadata,
  dropboxMetadata,
  numbersGameMetadata,
  miuMetadata,
  hashCodeMetadata,
]

const Home: NextPage = () => {
  return (
    <Container activeId="blog">
      <h2 className="text-3xl mb-4">{"Blog index"}</h2>
      <ul className="">
        {BLOG_ENTRIES.map((metadata) => (
          <li key={metadata.title} className="mb-2">
            <Link className="link" href={`/blog/${metadata.slug}`}>
              {metadata.title}
            </Link>
            {" - "}
            {metadata.date}
          </li>
        ))}
      </ul>
    </Container>
  )
}

export default Home
