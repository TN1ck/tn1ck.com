import Link from "next/link"
import React from "react"

const LINKS = [
  { title: "About", id: "about", link: "/" },
  { title: "Projects", id: "projects", link: "/projects" },
  { title: "Blog", id: "blog", link: "/blog" },
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
  className,
  children,
}: {
  activeId: string
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div>
      <main className="max-w-screen-md m-auto mt-8 mb-16">
        <Navigation activeId={activeId} />
        <div className={className}>{children}</div>
      </main>
    </div>
  )
}

export default Container
