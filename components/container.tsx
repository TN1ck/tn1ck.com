import Head from "next/head"
import Link from "next/link"
import React from "react"

const LINKS = [
  { title: "about", id: "about", link: "/" },
  { title: "projects", id: "projects", link: "/projects" },
  { title: "blog", id: "blog", link: "/blog" },
]

const Navigation = ({ activeId }: { activeId: string }) => {
  return (
    <nav className="mb-8">
      {LINKS.map((link) => (
        <Link
          key={link.id}
          href={link.link}
          className={
            activeId === link.id
              ? "pt-4 pb-1 mr-4 border-b-2 border-black font-bold"
              : "pt-4 pb-1 mr-4"
          }
        >
          {link.title}
        </Link>
      ))}
    </nav>
  )
}

const Container = ({
  activeId,
  className,
  children,
}: {
  activeId: string
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div>
      <Head>
        <meta name="author" content="Tom Nick" />
        <meta
          name="description"
          content="Tom Nick's personal website and blog"
        />
        <title>tn1ck.com</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-screen-md m-auto mt-8 mb-16">
        <Navigation activeId={activeId} />
        <div className={className}>{children}</div>
      </main>
    </div>
  )
}

export default Container
