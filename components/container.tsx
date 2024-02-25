import type { NextPage } from "next"
import Link from "next/link"
import React from "react"

const LINKS = [
  { title: "About", id: "about", link: "/" },
  { title: "Projects", id: "projects", link: "/projects" },
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
              ? "pt-4 pb-2 mr-4 border-b-4 border-black"
              : "pt-4 pb-2 mr-4"
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
  children,
}: {
  activeId: string
  children: React.ReactNode
}) => {
  return (
    <div>
      <main>
        <Navigation activeId={activeId} />
        <div className="">{children}</div>
      </main>
    </div>
  )
}

export default Container
