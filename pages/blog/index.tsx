import type { NextPage } from "next"
import Link from "next/link"
import Container from "../../components/container"
import { METADATA as updatePlansMetadata } from "./update-plans"
import { METADATA as miuMetadata } from "./miu"
import { METADATA as numbersGameMetadata } from "./numbers-game"

const BLOG_ENTRIES = [updatePlansMetadata, numbersGameMetadata, miuMetadata]

const Home: NextPage = () => {
  return (
    <Container activeId="blog">
      <h2 className="text-3xl mb-4">{"Blog index"}</h2>
      <ul className="list-disc list-outside">
        {BLOG_ENTRIES.map((metadata) => (
          <li key={metadata.title} className="mb-2">
            <Link className="link" href={`/blog/${metadata.slug}`}>
              {metadata.date} - {metadata.title}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}

export default Home
