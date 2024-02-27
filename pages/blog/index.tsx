import type { NextPage } from "next"
import Link from "next/link"
import Container from "../../components/container"

const Home: NextPage = () => {
  return (
    <Container activeId="blog">
      <h2 className="text-3xl mb-4">{"Blog index"}</h2>
      <ul className="list-disc list-outside">
        <li>
          <Link className="link" href="/blog/update-plans">
            {"Use update plans to handle large database updates"}
          </Link>
        </li>
      </ul>
    </Container>
  )
}

export default Home
