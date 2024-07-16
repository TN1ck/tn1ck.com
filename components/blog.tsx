import Link from "next/link"
import {
  FootnoteProvider,
  useFootnoteContext,
} from "../context/FootnoteContext"

export interface BlogMetadata {
  title: string
  date: string
  slug: string
}

export const Author = ({ date }: { date: string }) => {
  return (
    <div className="flex gap-1 text-xs">
      <time dateTime={date}>{date}</time>
      <span className="px-2">{"•"}</span>
      <address>By Tom Nick</address>
    </div>
  )
}

const Footnotes = () => {
  const { footnotes } = useFootnoteContext()

  if (footnotes.length === 0) {
    return null
  }

  return (
    <section>
      <h3 id="footnotes" className="text-xl mt-16 mb-4">
        Footnotes
      </h3>
      <ol className="blog">
        {footnotes.map((footnote, index) => (
          <li key={index}>
            {footnote}
            <a
              className="border ml-1 px-1 text-orange-500 border-orange-500 no-underline"
              href={`#footnote-${index + 1}`}
            >
              {"<-"}
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}

export const BlogContent = ({
  children,
  metadata,
  hideBackButton,
}: {
  children: React.ReactNode
  metadata?: BlogMetadata
  hideBackButton?: boolean
}) => {
  return (
    <FootnoteProvider>
      <article className="blog flex flex-col relative bg-slate-50 border-2 border-slate-900 p-4 md:p-8 mt-16">
        {!hideBackButton && (
          <Link
            className="absolute -top-2.5 -left-2.5 w-[19px] h-[19px] bg-white border-2 border-slate-900 cursor-pointer flex justify-center items-center"
            title="Go back to blog"
            href="/blog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </Link>
        )}
        {metadata && (
          <div>
            <h1>{metadata.title}</h1>
            <div className="-mt-4">
              <Author date={metadata.date} />
            </div>
          </div>
        )}
        {children}
        <Footnotes />
      </article>
    </FootnoteProvider>
  )
}
