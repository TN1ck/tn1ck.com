import hljs from "highlight.js/lib/core"
import go from "highlight.js/lib/languages/go"
import plaintext from "highlight.js/lib/languages/plaintext"
import clsx from "clsx"
hljs.registerLanguage("go", go)
hljs.registerLanguage("plaintext", plaintext)

export function CodeBlock({
  children,
  language,
  className,
}: {
  children: string
  language: string
  className?: string
}) {
  const myHtml = hljs.highlight(children.trim(), { language }).value
  return (
    <pre
      className={clsx("hljs p-4 overflow-scroll", className)}
      dangerouslySetInnerHTML={{ __html: myHtml }}
    ></pre>
  )
}
