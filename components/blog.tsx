export const Author = ({ date }: { date: string }) => {
  return (
    <div className="flex gap-1">
      <address>
        By{" "}
        <a
          className="link"
          rel="author"
          target="_blank"
          href="https://www.linkedin.com/in/tom-nick/"
        >
          Tom Nick
        </a>
      </address>
      {" on "}
      <time dateTime={date}>{date}</time>
    </div>
  )
}

export const BlogContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <article className="blog p-8 bg-white text-gray-800 shadow-md">
      {children}
    </article>
  )
}
